---
title: Facebook Re-Enables Controversial Tracking Cookie
date: 2011-10-03T18:21:30+00:00
excerpt: Facebook quietly re-enabled the datr tracking cookie on third-party sites after previously removing it, setting cookies on users who never visited Facebook
---

In May of this year the [Wall Street Journal reported](http://online.wsj.com/article/SB10001424052748704281504576329441432995616.html) that Facebook like buttons and other website widgets were setting cookies on visiting browsers. This cookie could then be read later and used to track the user across different web properties and back to the Facebook site. The cookie was being set even if the user had never been to the Facebook site, and even if they didn't click a 'like' or 'share' button.

<s>As a result of that report, Ashkan Soltani filed a bug with Facebook</s>, which was fixed, and the cookie in question – `datr` – was removed and was no longer being set for logged in or logged out users when they visited a page integrating Facebook. (Update: Ashkan tells me that he didn't file a bug, but that the cookie was removed by Facebook prior to the WSJ story being published).

Today, that cookie is back. It is being set by all the third-party sites that we tested.

![facbeook datr cookie](/images/posts/facebook-reenable01.webp)

_Image: Screenshot from Chrome showing the datr cookie being set by Facebook on a third party site_

## The datr Cookie

The `datr` cookie also came up in my previous post about the [Facebook logout issue](http://nikcub.appspot.com/logging-out-of-facebook-is-not-enough). You can see it in [the table published](http://nikcub.appspot.com/fb-table.html) accompanying that post.

The purpose of the `datr` cookie is, [per Facebook](http://nikcub.appspot.com/facebook-fixes-logout-issue-explains-cookies):

> We set the ‘datr’ cookie when a web browser accesses facebook.com (except social plugin iframes), and the cookie helps us identify suspicious login activity and keep users safe. For instance, we use it to flag questionable activity like failed login attempts and attempts to create multiple spam accounts.

Note that the response from the previous post mentions that the cookie is not set for social plugins. This is not the case right now.

It is the first cookie that is set, for all users of Facebook, and right now is being set for everybody on any Facebook integrated site – logged in or not logged in.

The recent [EU vs Facebook](http://europe-v-facebook.org) revelations about the data that Facebook stores for each users gave an interesting insight into the `datr` cookie. Below is a screenshot of some data from a user who retrieved their information using Europe vs Facebook. It shows machine ID's that were used to access that account, and the other accounts associated with that machine id.

![facbeook datr cookie](/images/posts/facebook-reenable02.webp)

_Image: Data captured from a Facebook user showing machine identification and association users_

We believe that the identifier used to associate each user with the machine ID is the `datr` cookie (highlited). The cookie referred to in the user data matches the format and the length of the `datr` cookie.

[Ashkan](https://twitter.com/ashk4n) has again submitted a bug report to Facebook about the `datr` cookie. We hope it is disabled again promptly. If this cookie was re-enabled accidently, it would be good to know how such a thing can happen. If it was enabled intentionally, despite all previous statements about third-party cookies being set, then a statement on why would be appropriate.

## Facebook on Datr

In [Facebook's response](http://www.datatilsynet.no/upload/Dokumenter/utredninger%20av%20Datatilsynet/From%20Facebook%20-%20Norway-DPA.pdf) to a questions from Norway's Data Inspectorate they state:

> For Facebook users, we obtain the consent for the use of a range of cookies when they sign up to our service. Our Privacy Policy makes it clear that these cookies may be accessed both on facebook.com and when they are visiting other websites with Facebook social plugins.

There is no mention of the `datr` cookie or collecting information on non-Facebook users. A user who never visits Facebook and is not a user will still have Facebook cookies set on their computer whenever they visit an integrating site (currently one-third of the top 1000 sites on the web).

## Tracking

In the [WSJ article](http://online.wsj.com/article/SB10001424052748704281504576329441432995616.html), Bret Taylor, the CTO of Facebook said about the `datr` and other cookies:

> “We don't use them for tracking and they're not intended for tracking,” he says.

There were similar responses in my previous posts from Facebook when asked about tracking:

> Generally, unlike other major Internet companies, we have no interest in tracking people. We don’t have an ad network and we don’t sell people’s information. As we state in our help center:, “We do not share or sell the information we see when you visit a website with a Facebook social plugin to third parties and we do not use it to deliver ads to you.”

Facebook keep the data collected for up to 90 days and then delete it. I believe them when they say this and that they are not hiding anything, but I also believe that our definitions of tracking differ. **If you set a cookie on a users machine from one website, and then read that cookie from that persons machine from another website, that is tracking**.

Also, if you look at the machine information above, the “First Seen” field above is **a date that is earlier than 90 days prior** to the records being requested.

Facebook can't help but to track, since they are being sent the cookie by the browser on subsequent requests. They read the cookie, which means that they know it is the same visitor. In my mind it doesn't matter if they do nothing with this data and then delete it after three months, it is still tracking and still has the potential to violate the privacy of users simply by being collected.

At a minimum they are tracking by reading the cookies, and if you look further into some of [the patents](https://www.seobythesea.com/2011/09/facebook-patent-application-target-ads) that Facebook has filed, as well as their business model (advertising), it is not a big leap to make to conclude that Facebook are tracking users and analyzing that data.

_Thanks to [@jonathanmayer](http://twitter.com/#!/jonathanmayer) on Twitter who first noticed the cookies again and reported the issue_. Also, all credit for the Facebook patent find should go to [Bill Slawski](http://www.seobythesea.com/2011/09/facebook-patent-application-target-ads) who did the leg work and wrote the original post. There have been a few other posts that didn't credit Slawski with the find.
