---
title: Persistent and Unblockable Cookies Using HTTP Headers
date: 2011-08-19T04:40:44+0000
excerpt: Using HTTP headers as unblockable super-cookies
---

There was a big [story](https://ashkansoltani.org/docs/respawn_redux.html) last week about published research that claimed analytics company KissMetrics were tracking users across multiple sites using a unique `ETag`([spec](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.19)). KissMetrics [denied](https://blog.kissmetrics.com/official-kissmetrics-response-to-data-collection-practices/) that they were using ETags to track users, <s>and they have filed a lawsuit against the author of the research piece</s> (**Note**: see update at the bottom of this post).

The ETag (short for '<strike>element</strike>_Entity_ tag') method of tracking users has been known and used in affiliate schemes since early [last decade](http://www.arctic.org/~dean/tracking-without-cookies.html). It is also known that the `Last-Modified`([spec](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.29)) header can, in theory, be used to track users by setting a unique update time.

What I do not believe is well known is that the `Last-Modified` header accepts any random string – it does not have to be a verified date.

The best way to demonstrate this is to show an example. This example uses a [demo page](/tracking-cookie) I have setup that sets random modified dates. If you refresh after setting the modified field you can verify that your browser replays the unique string.

## Initial Request

Here is the initial request to the server. Nothing unusual here.

## Server Response: Setting the token

The server responds and sets a unique identifier (in this case an UUID that I generate) as the `Last-Modified`([spec](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.25)) date:

Note that normally if this method of caching is used the server response header will be a standard datetime string:

**Subsequent Browser Requests**

The browser now sends this token along with subsequent requests to the same URL using the `If-Modified-Since`([spec](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.25)) header. It is asking _'if the modified date of this resource newer than this date, send it to me'_ – but it is replaying the unique identifier rather than a date.

It works after closing and restarting the browser, and works in all the major browsers. The ETag method doesn't work in all cases, especially with web proxies, but the Last-Modified method does.

## Solutions

The problem with these techniques is that they bypass user and browser privacy settings centered around cookies. You can block all cookies and yet ETag, Last-Modified and other methods can be used to track your browser.

In terms of `Last-Modified`, the spec says that it should be a date – but it also mentions that there are potential issues with the clock being out of sync. Most library implementations simply store and replay the date string – they do not bother attempting to parse it since date parsing is such a pain in the ass. Browsers are doing the same thing, which is why this bug exists. It means that `Last-Modified` works just as well as a cookie, but **without the privacy controls**

I will be filing a bug report with the open source browsers and requesting that the date is parsed properly. This won't completely solve the problem, since users can still be tracked by setting a unique datetime – but perhaps one of the more innovative browser's will come up with a solution where the time is rounded off to the nearest hour, and some basic sanity checking is done. There is no other real solution, other than clearing and disabling your cache, but conditional GET's still take place during a browser session with some browsers.

Try this bug out yourself by using the [demo page](/tracking-cookie) I have setup.

## Addendum

The privacy plugin that I am working on, [Parley](https://github.com/nikcub/parley), would solve the cross-site tracking aspect of this bug, since it blocks all third party requests. I am thinking of adding date verification and fudging to it as well. Something to work on the next time I pick that project up (there is only so much you can do with plugins, which leads to a temptation to fork Webkit and build a privacy and security-aware browser)

**Note:** In an earlier version of this post I said that KissMetrics had filed a lawsuit against the author of the ETag [research piece](https://ashkansoltani.org/docs/respawn_redux.html). This was not accurate. KissMetrics have filed a counter-suit against a law firm who have sued them and their clients. The author of the report, [Ashkan Soltani](https://ashkansoltani.org/), has nothing to do with the KissMetric lawsuit. Apologies to him for getting it mixed up.
