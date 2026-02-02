---
title: Relevance Time for Twitter
date: 2010-10-29T13:57:31+00:00
excerpt: Why chronological ordering in Twitter is baggage from old computer systems and why relevance-based sorting using user gestures is inevitable
---

A little over a year ago on Techcrunch I wrote [Relevance over Time](http://techcrunch.com/2009/10/12/relevance-over-time/), a post about how the default view of chronological ordering of messages in applications was not suited to the web, where applications now have enough gestures from users to be able to sort by relevance.

Chronological ordering in Twitter, Facebook, Gmail, blogs etc. is baggage carried over from old computer networks and time-share systems.

I wrote:

> A chronological system for indexing information breaks down quickly once the amount of information received reaches a certain critical point. Active users of email constantly moan about the information overload they experience, and the information is only a load because it is difficult to sort through and manage in modern systems. According to the cognitive theory of choice complexity, that feeling of load multiplies with each incremental increase in choices and decisions having to be made. In the email world this leads to a complete breakdown, and the trend of email bankruptcy (deleting all email and starting again).

and

> Chronological order needs to be abandoned in favor of relevance. Without relevance, our ability to manage large sets of information is inefficient. The technology for relevance exist today, for eg. spam filters are able to tell us what we definitely don’t want to read.

I recall the post being born out of frustration. The social networking services and other web applications collected and logged almost every gesture I made on the web – from liking something to deleting an email. That information was being used to better target ads at me (Russian brides – thank you Facebook) benefiting the app publisher, but it was not being used to benefit me – namely in the form of being able to view my data by relevance and in-turn increasing my productivity.

In the year following that post, Facebook switched the default news feed view to one based on relevance and Gmail launched priority inbox – a new view of email based on relevance (that works so damn well, and as [Fred Wilson points out](http://www.avc.com/a_vc/2010/10/the-impact-of-priority-inbox.html) perhaps too well). Some larger blogs are beginning to abandon the chronological view, such as the new [Gawker beta](http://beta.gawker.com) (and it was also something I prototyped while at Techcrunch). The past 12 months has seen a complete shift away from the old of chronological order to the new of relevance powered by user gestures.

There is a single large service that is currently lagging in this field, and it is the one service that suffers greatly from information overload and an over-reliance on time, and that is Twitter. The average tweet amongst the users that I follow is usually not time sensitive – what interests me is more likely to be a link to a blog post or a conversation on a tech issue, not a tweet about where somebody is at a particular time. My scroll-back rate on Twitter is very low, in the order of 2-3 hours worth of messages at the most. I expect that I am not unique amongst users in this case – and I expect that most tech users of Twitter have an even lower scroll-back window, especially since the average number of people being followed by the tech early adopters has steadily increased over time.

The number of people an average user follows steadily increases over time, resulting in more messages and shorter scroll-back windows – meaning that the number of tweets actually being read as a proportion of all tweets would be steadily decreasing, despite more users. A lot of good content goes unnoticed. This is a situation begging for a relevance ordering solution.

Such a solution may seem to cut at the core of what Twitter is, but I feel it is inevitable that the company will end up somehow sorting tweets by relevance (or a hybrid thereof). I was hoping that New Twitter was a relevance solution, and not a redesign. The lack of action to-date opens an opportunity for an enterprising developer to build a solution, and perhaps sell it back to Twitter (the precedent is search). A third-party solution would not have access to the gestures that Twitter see, but a solution using the remaining variables (ie. most popular users, most favorited, most re-tweeted, time spent on screen, age of relationship, etc.) should be enough data for a rough cut.

With a relevance solution to Twitter, it also raises the specter of dynamic follow lists. ie. A very good and relevant tweet from somebody who I do not directly follow, but who may be 2 degrees away from me, could creep into my feed. This means that a new account on Twitter could seed their feed with some initial interesting account, or interesting Tweets, and the feed will dynamically shift itself and pick up what is most relevant to the user (solving the Twitter bootstrap problem as well)[^1]. The logic to this is not so overly complicated that it can not be achieved at scale, even for a third-party solution.

Twitter is one of the last remaining services from my post last year that are still in a chronological world, but the new opportunities that arise from the company potentially approaching a relevance-based default view are more exciting than either Gmail, Facebook or blogs.

[^1]: After watching an episode of one of the daily talk shows (Oprah or The View, or whatever), my mother, to my amazement, asked me to 'get her a Twitter'. She imagined 'Oprah on Twitter' or 'Ellen on Twitter' being more like a TV channel or network, rather than what it is now with signing up, profile, subscribe → search → subscribe → search etc.
