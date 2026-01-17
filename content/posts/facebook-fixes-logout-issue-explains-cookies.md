---
title: Facebook Fixes Logout Issue, Explains Cookies
date: 2011-09-27T13:53:48+00:00
excerpt: Facebook fix their logged out user privacy issues in response to my earlier post
---

I wrote [a post two days ago](/post/logging-out-of-facebook-is-not-enough) about privacy issues with the Facebook logout procedure which could lead to your subsequent web requests to third-party sites that integrate Facebook widgets being identifiable and linked back to your real account. Over the course of the past 48 hours since that post was published we have researched the issue further and have been in constant contact with Facebook on working out solutions and clarifying behavior on the site.

My goal was to both identify bugs in the logout process and see that they are fixed, and to communicate with Facebook in getting some of the unanswered questions answered so that the Facebook using public can be informed of how cookies are used on the site – especially with regard to third-party requests.

In summary, Facebook has made changes to the logout process and they have explained each part of the process and the cookies that the site uses in detail.

### The Data

To help better understand the cookie data that we have collected, I have formatted it into a table that displays the lifetime of each cookie across a number of different web requests. The table can be found on a [separate page here](/fb-table.html). You can find the raw output from my Firefox session [here](/fb-headers.txt).

The rows of the table represent each cookie found throughout the debugging session. The first column is the name of the cookie. Each subsequent column shows how the value of the cookie was altered (or not) throughout the following four page requests:

1. A logged in request to `facebook.com`
1. A request to the 'logout' action within Facebook
1. The immediate request of the Facebook homepage
1. A subsequent request to the Facebook homepage after restarting the browser

The table is color coded so that it is easier to see which cookies are altered and which cookies never change. **The data shows that five cookies retain value after the logout procedure and a browser restart, while a further two survive the logout procedure and remain as session cookies.**

### The Fix

The five cookies that persist are `datr`, `lu`, `p`, `L` and `act`. The two cookies that also persist after the logout procedure as session cookies are `a_user` and `a_xs`.

The most important of these is `a_user`, which is the users ID. **As of today, this cookie is now destroyed on logout** . Facebook had the following to say about the `a_user` cookie:

> What you see in your browser is largely typical, except a_user which is<br/>
> less common and should be cleared upon logout (it is set on some photo<br/>
> upload pages). There is a bug where a_user was not cleared on logout. We will<br/>
> be fixing that today.

The other 'a' cookie, `a_xs`, is now also deleted on logout. `a_xs` is used to prevent cross-site request forgery.

### The Other Cookies

This leaves a number of other cookies, and I will be explaining the purpose of each one as per information from Facebook.

The `datr` cookie is set when a browser first visits facebook.com. The purpose of it, as per Facebook, is:

> We set the ‘datr’ cookie when a web browser accesses facebook.com (except social plugin iframes), and the cookie helps us identify suspicious login activity and keep users safe. For instance, we use it to flag questionable activity like failed login attempts and attempts to create multiple spam accounts.

The `lu` cookie is also set the first time a browser visits facebook.com and is used to <s>identify the browser</s> pre-fill the users email address in the login form. The purpose of it, as per Facebook again, is:

> the ‘lu’ cookie helps protect people using public computers. The data it contains is used to make subtle changes to the login form, such as prefilling your email address and unchecking the “Keep me logged in” option if we detect multiple users signing in with the same browser. If you log out, this cookie does not contain your user id and Facebook will not prefill the email field.

These cookies, by the very purpose they serve, uniquely identify the browser being used – even after logout. As a user, you have to take Facebook at their word that the purpose of these cookies is only for what is being described. The previous `a_user` cookie that was fixed identified your user account and has been fixed, these cookies identify the browser and are not re-associated with your logged in account.

Most of the remaining cookies are not very interesting – they set things like the language of your browser and device dimensions. The most interesting cookie, for me (after the userid, obviously), was `act`. The values for this cookie for the requests I logged were `1316962370811/2;`, `1316972790935/11;` and `1317032073811/0;`. It is a timestamp for each request, in milliseconds since [UNIX epoch](http://en.wikipedia.org/wiki/Unix_time) (1st January 1970). What interested me was that not only was the timestamp accurate to milliseconds (ie. thousandths of a second) but that an additional number was being added to it. My gut instinct was that the additional number (ie. the /11, /0 and /2 in those exaples) was being added to make the timestamp unique for each and every request. Facebook confirmed this:

> It is a monotonically increasing counter of actions since the start of logging. As we shared, this is for the collection of performance data — nothing else.

I understand the technical reason for that – they can store the timestamp as a primary key in their logging backend and not have to associate benchmarking of each request back to a user. I believe Facebook here when they say that although this is a unique identifier it isn't used to link back to a user id – but it is definitely being logged and it _can_ be linked to a user.

### Where Now

Facebook has changed as much as they can change with the logout issue. They want to retain the ability to track browsers after logout for safety and spam purposes, and they want to be able to log page requests for performance reasons etc. I would still recommend that users clear cookies or use a separate browser, though. I believe Facebook when they describe what these cookies are used for, but that is not a reason to be complacent on privacy issues and to take initiative in remaining safe.

I discovered a lot of other issues and interesting areas ripe for further investigation while researching the cookie logout issue – and I will be taking each one of them up on the blog here in the near future.

I must thank Gregg Stefancik, an engineer at Facebook who reached out (and also left the 'official' Facebook response as a comment on the previous post) and who worked with us on this issue. Thank you as well to other Facebook engineers who reached out. On my end [Ashkan Soltani](http://ashkansoltani.org/) and [Brian Kennish](http://twitter.com/byoogle) (author of the excellent [disconnect](http://disconnect.me/) browser plugins that every user should be running) were invaluable with providing tests, advice and additional sets of eyes.
