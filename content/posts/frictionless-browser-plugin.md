---
title: Introducing Frictionless - Taking the friction out of Facebook social-sharing applications
date: 2011-12-04T21:02:09+00:00
excerpt: We write a browser plugin to provide better privacy for Facebook users
---

<img src="/images/posts/promo.png"/>

Today we are launching [Frictionless](https://chrome.google.com/webstore/detail/ajingfifiphifhhjfmfcpklnphcijocg), a browser extension (chrome only at the moment) that rewrites the default features of Facebook social-sharing and provides users with privacy and the ability to read the original source websites for shared articles.

If you are a Facebook user, you have probably seen the new social-news sharing applications such as the Washington Post Social Reader, The Guardian application and the WSJ app. They are the apps that send out notifications to your Facebook stream when you read an article, and also filter up popular read articles from your friends into your newsfeed.

The problem with these applications is that they share almost every user action by default. Further, most of these applications require the user to authorize the application (which means it can read all of your profile data) in order to read a story. Since the launch of the new Open Graph API and these social applications, there has also been much criticism in the media and [amongst bloggers](http://news.cnet.com/8301-31322_3-57324406-256/how-facebook-is-ruining-sharing/). You have probably come across a story in your timeline and clicked on it only to be confronted by a dialog box that looks like this:

<img src="/images/posts/20111204-n7d44snb1w7ud671gkfc7wu985.jpg"/>

There is no consistant behavior across the applications. Some of them require an install, some of them allow you to hit cancel and still read the article, some of them load an alternate version of the article within Facebook, while others open the original website.

Facebook refer to this as 'frictionless sharing', but from my own user experience (and the experience of others), this method of sharing stories is anything but _frictionless_. In fact, it is downright confusing.

Our plugin is very simple. Once installed, it will rewrite all of the social sharing links within Facebook to point directly to the source website. Click on a link from the newsfeed or from the social stream (or whatever its called) and you will be taken straight to the original website. No more dialog boxes, no more automatic posts about what you are reading, and no more handing over your entire user profile and Facebook identity to a media company in exchange for reading a story.

You can install the plugin by visiting the [Chrome Web Store](https://chrome.google.com/webstore/detail/ajingfifiphifhhjfmfcpklnphcijocg). The source code is available on our project page [at GitHub](https://github.com/byoogle/frictionless/). Safari and Firefox versions will be available shortly (we welcome any effort to fork, port and pull – because honestly, we haven't started either of those). Operating it is easy – just install and forget about it – there are no options, anything to customize or any buttons to press.

This is also just a first release that solves the reading portion of Facebook sharing. In the next release, we will be including a way to share stories you have read (opt-in) from any website into the Facebook social stream.

This plugin was conceived on Facebook a couple of days ago and was written by [Brian Kennish](http://twitter.com/byoogle) of [Disconnect](http://disconnect.me/) and myself. Feedback and bugs can be [filed at GitHub](http://github.com/byoogle/frictionless/issues), by emailing either of us or finding us [on Twitter](http://www.twitter.com/nikcub). Hope you enjoy the extension.
