---
title: BlockPlus - A browser extension to block Google+ notifications
date: 2011-07-06T21:06:08+0000
excerpt: Releasing BlockPlus, a Chrome extension that removes Google+ links and notifications from the nav bar to prevent the constant distraction of the new social network
---

<img alt="BlockPlus extension icon" src="/images/posts/5909374213_cbae62eb55_m.webp"/>

Google recently launched their much-publicized social network [Google+](http://plus.google.com). I [signed up](https://plus.google.com/105854725972317368943) early on, but found that having the new status bar across the top of all the other Google applications was becoming a distraction.

Earlier today I went into Gmail to send a simple email, and the Google+ notifier caught my attention. I clicked on it and ended up spending 30 minutes browsing through various posts, adding people, etc. Then I noticed [a tweet from Sacca](http://twitter.com/#!/sacca/status/88653313096163329) saying the same thing, that he was being distracted by the notifier.

It prompted me to write a quick browser plugin (Chrome only at the moment) to block all references to Google+ from the global Google nav. It is called [BlockPlus](http://bitbucket.org/nik/blockplus) and you can install it right now by [clicking here](http://nikcub.appspot.com/static/blockplus-2.crx).

BlockPlus will remove any links to Google+ in the global nav, including the profile link, circles, etc. It will also remove the notifier. It blocks the requests, and also hides those elements from view – so you are not only hiding it but saving on 6-7 HTTP requests that normally take place each time you hit the global nav.

The project is hosted on my BitBucket, so you can download, fork and view the source. If you find any issues or have any feedback, please [submit a ticket](https://bitbucket.org/nik/blockplus/issues).

<button onclick="document.location='http://nikcub.appspot.com/static/blockplus-2.crx';return false;">Install BlockPlus for Chrome</button>

## Screenshot

<img alt="BlockPlus Chrome extension blocking Google+ notifications" src="/images/posts/5909661385_79445883de_b.webp"/>
