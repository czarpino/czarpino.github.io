---
layout: simple.post
title: What every developer should know about HTTP Status Codes
---

> **Interviewer**: Tell me about HTTP status codes
> 
> **Interviewee**: ... Hypertext Transfer Protocol ... 404, 200, 301 ...

There are over a dozen HTTP status codes defined in the spec but you only need to know a handful to get your web-development-fu to the next level. Interestingly, status codes are categorised into just 5 classes:

1. 1xx - Informational
2. 2xx - Successful
3. 3xx - Redirection
4. 4xx - Bad request
5. 5xx - Server Error

## Informational 1xx

An intermediate response containing meta-info relevant to the actual response. Informational responses are provisional and serves only to relay possibly useful information in handling the actual response. Examples:

1. `100 Continue`
2. `101 Switching Protocols`

I have not seen these in practice and I think developers rarely ever need to handle this sort of response.

## Successful 2xx

This is the response you want for at least 99% of requests. A successful response indicates that the request has been successfully processed by the server. Examples:

1. `200 OK`
2. `201 Created`

## Redirection 3xx

In practice, this means that the resource requested is available on a different location. Typically, the user-agent (usually the browser) deals with this response so the end user don't even have to do anything. Examples:

1. `301 Moved Permanently`
2. `304 Not Modified`

## Bad Request 4xx

Bad request responses indicate that the user has made a bad request such as trying to access a secured resource without authorization (`403 Forbidden`) or requesting a resource that does not exist (`404 Not Found`). This response is typically used to point out the user's fault for the rejection of the request. Examples:

1. `403 Forbidden`
2. `404 Not Found`

## Server Error 5xx

Server error responses indicate that the server (possibly including anything between the server and client) is at fault for failing to fulfil the request. If you're a developer and your website spits out this error code, you have something that needs fixing. Example:

1. `500 Internal Server Error`

# Conclusion

A more comprehensive article on HTTP status codes is available on the [Status Code Definition page](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html). 



