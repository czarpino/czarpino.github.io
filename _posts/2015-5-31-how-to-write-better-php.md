---
layout: simple.post
title: How to write better PHP
categories: programming
---

PHP is one of the easiest languages to use for web development and this ease has lowered the barrier to web programming. However, it has also increased the effort to write good code and, consequently, the bar for becoming a good programmer.

There is much to be said about the flaws of PHP as well as it's growth and there is a wealth of such articles already out on the web. When working with PHP however, rigour and discipline are needed to make up for the shortcomings of this otherwise beautiful language.

# Use a framework

Arguably, the single best way to get better in PHP is to adopt a good framework. And I, personally, could not recommend [Symfony](http://symfony.com) enough. Symfony is one of the oldest and most popular PHP frameworks. It's components are even used by other frameworks such as Laravel and Drupal. Despite the popular belief that Symfony is not opinionated,  it is actually quite so on areas that really matter when building good software. It has a rigour which makes bad coding practices difficult, if not awkward, to do.

# Adopt a coding standards

Next to a good framework, the strict adoption of coding standards and best practices is the most practical way of writing quality PHP software. A codebase with a standardised way of formatting is both easier to read and understand. And as any who has worked on someone else's software can second, understanding what a piece of code does is 50% of the job.

As a side benefit also, the programmer no longer has to fret on menial formatting decisions e.g. indenting with tabs vs spaces. To which of course, the sensible choice are spaces.

# Engineer software

Software should not merely be encoded in a flat manner but rather it should be designed and built to be robust, reliable, and reusable. There are well-known qualities of great software and guidelines to building them. A good programmer must be knowledgeable and able to utilise them appropriately.

## Write SOLID software

Supporting class based object oriented programming and having an uncanny resemblance to Java, software design principles are largely applicable to PHP. Robert Martin gathered 5 design principles for software development now popularly referred to with the acronym [SOLID](http://williamdurand.fr/2013/07/30/from-stupid-to-solid-code/).

1. Single Responsibility Princinple
2. Open Close Principle
3. Liskov Substitution Principle
4. Interface Segregation Principle
5. Dependency Inversion Principle

## Strive for high cohesion and low coupling

Cohesion and coupling are generic metrics of software quality invented by Larry Constantine in 1960. A software with "high cohesion and low coupling" is desirable and associated with good qualities such as robustness, reliability, reusability, and understandability. Concisely, this metric favours software where classes or modules  are composed of strongly related elements (i.e. methods, variables, or classes) and have as few inter-class or inter-module dependencies as possible.

## Recognize recurring design problems

Over time, programmers have noticed that some software design problems tend to repeat themselves in the course of development or on each new software. The solutions to this commonly recurring design problems came to be known as design patterns.

One particular must-know design pattern is [Dependency Injection](http://fabien.potencier.org/article/11/what-is-dependency-injection), which has become a standard for managing object dependencies.

# Write unit tests

Everyone agrees, testing is good but not as many do it. Unit testing is probably the hardest to pick up in this list. Not as much as it is difficult to do as it is unsexy and boring.

The main drawback of writing tests is it neither adds features nor fixes bugs in a software. Time spent writing a test could be spent writing a new feature, fixing a bug, or refactoring to a new technology.

Unit tests, however, are priceless when ensuring the robustness of software. It serves as a harness when making modifications to the codebase and helps prevent dreaded regression bugs, thereby increasing the quality of software on a high level. In many companies, quality control alone is more than enough to create a separate testing department and the same goes in software development.

In fact, try and approach any reputable tech company with an enterprise software you've made. And chances are, they'll ask you "what's your test coverage?".

# Conclusion

It is easy to be a PHP programmer and equally hard to be a good one. Modern web development is expanding at an incredible pace and the rigor once widely promoted in programming now seem to be put at a dangerously low regard. As exciting as all the development is, the basics are still  and always as important. Afterall, no amount of shiny new technology can take the place of a good programmer.
