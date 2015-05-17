---
layout: simple.post
title: Symfony Tips
---

One of the things that make Symfony a great framework is it's very high flexibility. It rarely  limits the developer to just one way of doing things but instead often provide several alternatives to choose from. Ironically, this is also one of it's pain points because it requires a lot of upfront decision making to be made: where to put services, how to group classes, what configuration format to use, which ORM to use, etc.. Basically, the responsible developer will be faced with the reccurringly imposing question: "which way should I choose and why?".

Recently, a collegue asked me about organizing a Symfony project. That makes the fourth time I've been asked in the past year. By no means am I an expert but to anyone else who'd ask, here are my pseudo-randomly collected suggestions.

## Read the official best practice book

Interestingly, the Symfony team has put forward an official set of best practices which includes an opinionated project structure. The book addresses many of the common issues that tear at developers as they bootstrap their Symfony project. While I do not agree with everything, it provides a solid baseline for organizing a Symfony project. Check out the [Symfony Official Best Practice book](http://symfony.com/doc/current/best_practices/index.html).

## Use defaults

Defaults are powerful and, fortunately, Symfony uses sensible defaults. In most cases, you should take advantage of them for simplicity and to reduce the learning curve.

## Annotate

Prefer annotations over YAML, XML, or PHP. Annotated configurations are more semantic as they are usually in proximity of the elements they affect. Annotations also result in a more straightforward way to look up related configurations.

## Maximize controller-to-framework coupling

> Overall, this means you should aggressively decouple your business logic from the framework while, at the same time, aggressively coupling your controllers and routing to the framework in order to get the most out of it.

I think this section in the Best Practice book deserves a special mention 

While high cohesion and low coupling is generally desirable and are considered hallmarks of well-written software, it's price is productivity and time-to-market (or at least the time it takes to get software live online).

Business logic should be decoupled from the framework but controller logic should be aggressively coupled. Don't mind too much about this coupling as controllers usually neither get reused elsewhere nor contain any heavy-lifting logic. The amount of time spent on decoupling, here, is better spent writing a user facing feature or writing a test.

## Strive to reduce future development efforts

One important factor to consider, when choosing one way of doing things over another, is identifying whether it will reduce future development efforts. There are several guidelines to help programmers build good software but I find this the most practical. If the cost of centralizing authentication, for instance, is less than rewriting authentication code in the controller (over and over again) then *do* refactor it. This is a very important consideration which, interestingly, also applies in to fields outside software development.

## Use database migrations

This is a no-brainer but surprisingly many developers are not doing this. Apart from the actual database definition, *exclusively* use database migrations to add, modify, or remove database tables and fixtures. Avoid manually tweaking the database structure.

## One controller class per page

This one is somewhat personal preference. I don't beleive there is a wrong way to do this but putting a little thought into how to organize controllers shouldn't hurt. Besides, it's not rare to get asked: "So, how do you organize controllers?".

Controller classes are simply a way to group related controllers. I group controllers by page. in doing so, controller class names become more meaningful and are easier to identify at a glance. 

Occasionally, there will also be controllers invoked from multiple pages -- usually via ajax calls. I group these controllers into classes by feature and collect these feature-controller-classes under an Api directory.

    AppBundle/
        Controller/
            Api/
                UserController.php
            SignupController.php
            ProfileController.php
            SettingsController.php

## Separate form from entity

Symfony forms can be bound to an entity object which is used to represent the underlying data. This, however, is not a good idea as actual forms used do not usually match all feilds of an entity and vice-versa. In terms of validation, different forms that collect data for the same entity can have different validation rules. Moreover, there are also cases when a single form collects data for multiple entities!

In practice, it is easier to set up separate forms per controller that handles a form submission. Validation rules should also be set per form. And lastly, form data should be manually (in contrast to the automatic binding of values when form is bound to an entity) transferred into the entity.

# Conclusion

It should be noted, though, that Symfony and PHP are being developed at a stunningly fast pace. This is generally good for the community and the vast web but it also means things are rapidly changing. Best practices change as well so consider this when working out the most sensible way of doing things. Lastly, what makes sense to me may not to you. I suggest *do what makes sense to you* -- unless we work together.
