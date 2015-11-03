---
layout: simple.post
title: API Authentication with RendrJS
categories: programming
---

Strangely, I have found very little on building an authentication subsystem in Rendr (or BackboneJS). The framework is almost skeletal so it's quite surprising how very few writings there are on extending functionality and adding modules. I found myself reading through the very source codes of Rendr to see how and where to integrate whatever I needed. Luckily, it was what I'd call a "good read" (a.k.a readable and comprehensible codes).  For posterity's sake and anyone going down the same path, this is how I engineered an authentication system for a RESTful API.

The authentication system I had in mind should perform 3 things:

1.    Secure an access token.
2.    Automatically sign API requests with the access token.
3.    Automatically retry an API request that fails due to an invalid/expired access token.

This way, authentication goes to a layer of its own where other components in the system need not be aware of it.

# Securing an access token

First and foremost, the auth system should provide a facility to *securely* acquire an access token. If it needs pointing out, requesting an access token from the API should only be done on the server-side to keep the client secret from leaking. To do this, I made an Express middleware which handled requests for an access token by performing the actual request to the API itself.

    // server/middleware/apiConnector.js
    module.exports = (function () {
        'use strict';

    	var express     = require('express');
    	var bodyParser  = require('body-parser');
    	var router      = express.Router();
    	var config      = require('config');
    	var request     = require('request');

    	router.use(bodyParser.json());
    	router.use(bodyParser.urlencoded({ extended: true }));

    	// Secure an access token with client credentials only
    	router.post('/access-token', function (req, res) {
    	    var options = {};

    		options.url = 'https://api.example.com/oauth/v2/token';
    	    options.method = 'POST';
    	    options.json = true;
    	    options.body = {
    	        client_id: config.client.id,
    	        client_secret: config.client.secret,
    	        grant_type: 'client_credentials'
            };

    		request.post(options, function (error, response, body) {
    	        var isSuccess = 200 == response.statusCode;

    	        res.setHeader('Content-Type', 'application/json');
    	        res.status(isSuccess ? 200 : 400);

    	        if (isSuccess) {
    	            var responseObject = body;
    	            req.session.data = req.session.data || {};
    	            req.session.data['access_token'] = responseObject['access_token'];
    	            res.status(200);
    	            res.write(JSON.stringify(responseObject));
    	        }

    	        res.end();
    	    });
    	});

    	return function apiConnector() { return router; };
    }());

For consistency, I group these endpoints under `/api`. Meaning, I mount the middleware on this path. The full path to the endpoint, then, became `www.example.com/api/access-token`.

    // index.js

    ...
    app.use('/api', mw.apiConnector());
    app.use('/', server.expressApp);
    ...

The actual client id and secret are set in the config file under `config/default.yml`, `config/development.yml`, or `config/production.yml`, depending on the environment.

    // config/default.yml
    # Default config: values here will be overriden by development/production

    # The application server will be available on this port.
    server:
        port: 3030

    # Client credentials
    client:
        id: 1_3sjxwwx1f0cgs8xxwg0s48sw4skko8goswkgc4wcsc0owokcg8
        secret: 86icp0w0beo0g8o00cs4s4kk48gkssg80kc4sg00g4ookwo5d8

    # `appData` is a hash of values that will be set on the `req.rendrApp` (middleware)
    # and `this.app` (models, views, controllers). These are available in both the
    # client and the server.
    appData:
        api:
            host: 192.168.33.10
            port: 80
            protocol: http

    # A long random string to be used for session id generation.
    session:
        secret: this should be some long random string

With this, I had a functional way to obtain an access token without leaking the client secret into the client-side. This endpoint can be tested by sending an empty POST request to `/api/access-token`. I use [Postman](https://www.getpostman.com/) to test my API endpoints. A typical response returns something similar to the following:

    {
    	"access_token": "YTk0YTVjZDY0YWI2ZmE0NjRiODQ4OWIyNjZkNjZlMTdiZGZlNmI3MDNjZGQwYTZkMDNiMjliNDg3NWYwZWI0MQ",
    	"expires_in": 3600,
    	"token_type":"bearer"
    }

# Signing and retrying a request

To avoid duplicate logic, signing an API request should be centralized. This was, however, not easily straightforward as server and client logic for making the request employs different components i.e. [BackboneJS](http://backbonejs.org/)/[jQuery](https://jquery.com/) on the client and [ExpressJS](http://expressjs.com/)/[Request](https://github.com/request/request) on the server.

## Server-side signing and request retry

The server side of things is largely the domain of Express. To extend server-side HTTP calls, I implemented my own DataAdapter. To be accurate, I only needed to extend Rendr's own RestAdapter (`rendr/server/data_adapter/rest_adapter`), overriding some functions to set an Authorization header with the access token before sending the request. I also needed to fetch an access token so there is actually something to set as well as retry a failed request afterwards.

    // server/ApiAdapter.js
    module.exports = (function () {
    	'use strict';

    	var RestAdapter = require('rendr/server/data_adapter/rest_adapter');
    	var util        = require('util');
    	var _           = require('underscore');
    	var url         = require('url');

    	function ApiAdapter(options) {
            RestAdapter.call(this, options);

            // Default options
            _.defaults(this.options, {
                authorizationToken: ''
            });
        }

    	util.inherits(ApiAdapter, RestAdapter);
        var proxyRequest = ApiAdapter.prototype.request;
        var proxyApiDefaults = ApiAdapter.prototype.apiDefaults;

    	// Augment RestAdapter#request with logic to fetch access token
    	// on failure then retry the request
    	ApiAdapter.prototype.request = function request(req, api, options, callback) {
            var _this = this;

            // Allow for either 3 or 4 arguments; `options` is optional.
            // Client code depends on this behavior so we have to keep it
            // when overriding.
            if (arguments.length === 3) {
                callback = options;
                options = {};
            }

            var callBackWrapper = function (err, response, body) {
                var statusCode = parseInt(response.statusCode, 10);
                var request = require('request');

                // Only deal with authentication error
                if (401 === statusCode) {

                    // Request an access token
                    var url = 'http://www.example.com/api/access-token';
                    request.post(url, function onAuthComplete(error, res, body) {
                        if (!error && res.statusCode == 200) {
                            var jsonBody = JSON.parse(body);
                            api.headers['Authorization'] = 'Bearer ' + jsonBody['access_token'];
                            proxyRequest.apply(_this, [req, api, options, callback]);
                        }
                    });

                    // Avoid invoking callback twice
                    return;
                }

                callback.apply(_this, [err, response, body]);
            };

            proxyRequest.apply(_this, [req, api, options, callBackWrapper]);
        };

    	// Automatically sign request with access token
    	ApiAdapter.prototype.apiDefaults = function (api, req) {
            var apiOptions = proxyApiDefaults.apply(this, arguments);
            if (req.session.data['access_token']) {
                apiOptions.headers['Authorization'] = 'Bearer ' + req.session.data['access_token'];
            }

            return apiOptions;
        };
    }());

This is how my rudimentary "ApiAdapter" looked like. All that's left was to configure the Rendr middleware to use this data adapter instead of it's RestAdapter.

    // index.js

    ...
    var server = rendr.createServer({
    	...
        dataAdapter: new ApiAdapter(config.appData.api)
    });
    ...
    app.use('/api', mw.apiConnector());
    app.use('/', server.expressApp);
    ...

At this point, the authentication system is complete for the server-side. The app can load pages that fetched models or collections from the API.

## Client-side signing and request retry

Being built on top of Backbone/jQuery for the client side, I had to override API syncing in Backbone's models and collections. Same as on the server-side of things, all API requests are signed with an access token. On failure, a new access token is requested then the failed request is retried.

### The API syncer

Following Rendr's approach to override Backbone's `sync` method, I created an `apiSyncer` module that extended Render's `syncer` and overrode `syncer#clientSync`, which is the client-side sync logic.

    // app/lib/apiSyncer.js
    module.exports = (function () {
    	'use strict';

    	var syncer = require('rendr/shared/syncer');
        var _ = require('underscore');
        var apiSyncer = _.extend({}, syncer);
        var proxyClientSync = apiSyncer.clientSync;
        var isServer = typeof window === 'undefined';

    	apiSyncer.sync = function sync() {
            var syncMethod = isServer ? apiSyncer.serverSync : apiSyncer.clientSync;

            return syncMethod.apply(this, arguments);
        };

    	apiSyncer.clientSync = function clientSync(method, model, options) {

            // We expect this function to only ever be invoked from the client
            var $ = window.$ || require('jquery');
            var _this = this;
            var _arguments = arguments;
            var successAction = options.success;
            var errorAction = options.error;
            var dfd = $.Deferred();
            var accessToken = _this.app.get('session')['access_token'];

            options.success = function () {};
            options.error = function () {};
            options.headers = options.headers || {};
            options.headers['Authorization'] = 'Bearer ' + accessToken;

            // Re-run sync operation
            function reSync() {
    	        var newAccessToken = _this.app.get('session')['access_token'];
                options.headers['Authorization'] = 'Bearer ' + newAccessToken;
                proxyClientSync.apply(_this, _arguments)
                        .then(dfd.resolve, dfd.reject);
            }

            proxyClientSync.apply(this, _arguments)
                    .done(dfd.resolve)
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        if (parseInt(jqXHR.status, 10) === 401) {
                            $.ajax({url: '/api/access-token', method: 'POST'})
                                .done(reSync)
                                .fail(dfd.rejectWith);

                            return;
                        }
                    });

            return dfd.promise().then(successAction, errorAction);
        };

        return apiSyncer;
    }());

### Extending base modules with the apiSyncer

The new syncer is then merged into the base modules for collections and models.

    // app/collections/base.js
    module.exports = (function () {
        'use strict';

        var RendrBase = require('rendr/shared/base/collection');
        var apiSyncer = require('../lib/apiSyncer');
        var _ = require('underscore');
        var baseCollection = RendrBase.extend({});

        _.extend(baseCollection.prototype, apiSyncer);

        return baseCollection;
    }());

    // app/models/base.js
    module.exports = (function () {
        'use strict';

        var RendrBase = require('rendr/shared/base/model');
        var apiSyncer = require('../lib/apiSyncer');
        var _ = require('underscore');
        var baseModel = RendrBase.extend({});

        _.extend(baseModel.prototype, apiSyncer);

        return baseModel;
    }());

Now every time a client-side request to the API server is made, requests automatically get signed with an access token and gets retried on failure. And with this, the API authentication system proof of concept is complete.
