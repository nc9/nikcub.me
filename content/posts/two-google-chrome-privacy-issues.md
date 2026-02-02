---
title: Two Google Chrome Privacy Issues
date: 2012-08-08T14:12:17+00:00
excerpt: Two privacy issues in Chrome where browsing history data persists after deletion - zoom level settings and DNS prefetch data leave traces of visited domains
---

I have recently discovered two privacy issues with Google Chrome that users should be aware of. They both relate to browsing history data not being deleted despite the user taking action to delete browsing history.

A Google Chrome user can delete browser history by going into `Preferences -&gt; Show Adavanced Settings -&gt; Clear Browsing Data`. The following dialog is presented:

_[Image unavailable - Skitch service discontinued]_

If you then click the 'Clear browsing data' button you would expect that all traces of websites that have been visited from the machine would be erased, but there are two instances where user visit data is retained.

I have tested both of these issues with the latest Chrome versions (including Canary) on both Windows and Mac.<br/>

## Issue 1: Zoom level information for a domain is retained

When visiting a web site in Chrome, if you zoom in and out (cmd + +/- or view -&gt; zoom in/zoom out) the browser will remember your zoom setting for that website. The next time you visit the same site it will apply your previous zoom setting automatically.

The zoom data is associated per domain, and is stored in the user Preferences file, which is part of the user profile – `~/Library/Application Support/Google/Chrome/Default` in OS X and `\Documents and Settings\%USER\Local Settings\Application Data\Google\Chrome\User Data\Default` on Windows (or AppData in Win8). The Preferences file is a plain text file that stores user preferences in JSON format.

The per host zoom settings are stored in this file and **not deleted** when the user deletes browser history, leaving a trail of visited domain names where the user has adjusted zoom settings.

An example of what it looks like:

```json
“per_host_zoom_levels”: {
    “”: -1.0,
    “1.bp.blogspot.com”: -0.5778829455375671,
    “2.bp.blogspot.com”: 3.0,
    “3.bp.blogspot.com”: 3.0,
    “4.bp.blogspot.com”: -2.22938871383667,
    “account.onetruefan.com”: -1,
    “acko.net”: -1.0,
    “allthingsd.com”: -1.0,
    “antirez.com”: -1,
    “api.jquery.com”: -0.5778829455375671,
    “apple.stackexchange.com”: -1.0,
    “archive.guardian.co.uk”: -1.0,
    “arstechnica.com”: -0.5778829455375671,
```

Any other user or process with access to the user profile can access this information.

This issue was [files as a bug](http://code.google.com/p/chromium/issues/detail?id=137412) on the 14th of July.

## Issue 2: DNS prefetched domains are not deleted with browsing history

DNS is used to translate a domain name (eg. xyz.com) to an IP address. The DNS lookup portion of a visit to a webpage can take anywhere from 10-50% of the load time, depending on the DNS server and network conditions.

To improve the performance and responsiveness of Google Chrome, the browser will 'pre-fetch' DNS queries and cache them in the user profile. It will perform DNS lookups in the background for any domain names it finds within a page you are visiting, and cache the results. When you click on one of the links, the cached result is used rather than a network lookup.

Google wrote a [thorough blog post](http://blog.chromium.org/2008/09/dns-prefetching-or-pre-resolving.html) about DNS prefetching in Chrome, how it works and the benefits.

In Chrome, if you open `chrome://dns` in the adress bar, you will see all the statistics for DNS prefetching.

As with the zoom issue, Chrome does not delete this DNS prefetch information when a user deletes browser history – meaning that a long list of visited domains (and other information) is left behind on a machine even after the user forcibly deletes the browser history.

Here is what the DNS prefetch information looks like in the Preferences file.

_[Image unavailable - Skitch service discontinued]_

This issue was [also filed as a bug](http://code.google.com/p/chromium/issues/detail?id=137414) on June the 17th.

There is a [blog post here](http://www.mydigitallife.info/turn-off-dns-prefetching-in-google-chrome-to-fix-resolving-host-and-cannot-load-page-error/) describing how to disable DNS prefetching in Chrome

## Potential Impact

If you are on a shared machine, such as a public terminal, you can learn the browsing habits and sites that are visited of previous users. This is most likely to be used in combination with other attacks.

Don't rely on the built-in features of Chrome to remove every trace of your web browsing history from a machine. With your browsing history, an attacker could find information about the services you use (such as your banking provider, etc.) in preparation for a spear-phish attack.

There is the simple issue of privacy and the potential mis-interpretation of what 'clear browser history' really means. I would have thought that this issue would be somewhat important in clearing up, by adding some simple routines to the history clearing functions, but there has been no action on it from developers on the Chromium project.
