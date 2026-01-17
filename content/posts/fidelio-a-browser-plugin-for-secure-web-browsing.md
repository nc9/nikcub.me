---
title: Fidelio - A browser plugin for secure web browsing
date: 2010-10-27T09:20:57+00:00
excerpt: I release a browser plugin that forces the browser to redirect to HTTPS versions of sites when available
---

A Firefox plugin called [Firesheep](https://github.com/codebutler/firesheep) was released this week. It allows users to hijack sessions sniffed from WiFi or other network through simple point and click. Session hijacking is a well understood security risk, but the script kiddie nature of Firesheep has caused a lot of response and reactions. Website developers and administrators are scurrying to implement measures to prevent the Firesheep attack vector – with solutions ranging from forcing SSL for all requests through to a second, alternate, secure cookie being set.

User sessions in web applications are usually tracked using a cookie. HTTP is a stateless protocol, meaning that between requests the server has no idea who the client is without a unique identifier. A cookie is a very simple tracking mechanism. The server will set a cookie by giving the client a long unique key which the client will send back with each subsequent request, allowing the server to identify the client and keep track of state. A user will login with a username and password, and in exchange will be given a session identifier to send back with each request.

Firesheep works by reading this unique identifier over the network (packet sniffing) and then replaying the request to access the users account. If you have a session identifier, you don't need a users password, you are the user.

Prior to Firesheep, session hijacking was a very real threat, but it was never as easy to exploit as it is with Firesheep.

## Fidelio

!["Fidelio screen](https://img.skitch.com/20101027-gak3mctyrk9nnmfabar2n1jq7y.jpg)

Amongst all the fuss around Firesheep a lot of blog posts and comments were made with recommendations on what users can do to prevent against this attack. The most common suggestion was some form of browser plugin that forces the browser to request websites using SSL, such as the Firefox plugin [Force-TLS](https://addons.mozilla.org/en-US/firefox/addon/12714/).

The problem with some of these plugins is that the initial request is still made over plain HTTP. They only switch over to HTTPS once the first request has been made. A second problem is that some do not protect requests that are made as part of widgets or share buttons embedded on other sites, such as Facebook like buttons (which send your session identifier as part of the request so that it can show you friends who have liked the item).

My solution is a browser plugin I call [Fidelio](http://github.com/nikcub/fidelio). It is currently only available for Chrome, as I have only spent a few hours working on it so far.

Fidelio does the following:

- For sites that the user sets up to secure (Facebook and Twitter by default), it will redirect requests to HTTPS.
- It will intercept and rewrite requests that are embedded in other web pages, such as Facebook like buttons.
- Most important, it will detect, read and re-write your **existing** session cookies and will set the secure flag, which means that the cookies will only ever be sent over an HTTPS connection.
- It allows the user to add any other domain to the list of secured/protected sites, from which point all requests to that site from anywhere will be made over SSL, and all cookies will be secured.

Some sites may break, but I have yet to find any. No information is leaked, because of the cookie method. At worst you will have to re-login to the sites that you add.

## Install

The plugin can be installed with a single click on this URL: **project taken down**

It will auto-update with new features (and I have some planned). To add additional sites, go to the Chrome extensions page (Window -&gt; Extensions) and click on the options page next to the extension listen. Add a domain (such as amazon.com, bofa.com etc.) and browse to the site.

If you are interested in the source code, it is [available on GitHub](https://github.com/nikcub/fidelio) (BSD licensed).

Issues or bugs can be [logged on GitHub](https://github.com/nikcub/fidelio/issues) and you can send me feedback by email (see [about](/about)).
