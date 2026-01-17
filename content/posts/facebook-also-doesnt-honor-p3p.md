---
title: Facebook and many other sites also bypass Internet Explorer privacy controls
date: 2012-02-21T04:40:52+00:00
excerpt: Facebook and Google found to be setting false P3P headers to bypass third-party cookie control
---

There is [a post](http://blogs.msdn.com/b/ie/archive/2012/02/20/google-bypassing-user-privacy-settings.aspx) today on a Microsoft MSDN blog about how Google bypasses third-party cookie control in Internet Explorer by setting a false P3P header. The post author is Dean Hachamovitch, who is the VP for IE, and follows up from a [big story last week](http://online.wsj.com/article/SB10001424052970204880404577225380456599176.html) about how Google and a number of other ad networks are bypassing third-party cookie blocking in Safari by using a workaround (the workaround involves an IFRAME and a form that is submitted automatically using Javascript).

The case with IE is different. Google (and many other sites) are taking advantage of the [P3P protocol](http://en.wikipedia.org/wiki/P3P) (a privacy extension to HTTP) to set third-party cookies. Here is a summary of what Google is doing, from the article:

> By default, IE blocks third-party cookies unless the site presents a P3P Compact Policy Statement indicating how the site will use the cookie and that the site’s use does not include tracking the user.

Here is what a valid P3P header looks like, as set by `microsoft.com`:

```
$ nc microsoft.com 80
HEAD / HTTP/1.1
Host: www.microsoft.com

HTTP/1.1 301 Moved Permanently
Connection: close
Date: Tue, 21 Feb 2012 04:29:06 GMT
Server: Microsoft-IIS/6.0
**P3P: CP='ALL IND DSP COR ADM CONo CUR CUSo IVAo IVDo PSA PSD TAI TELo OUR SAMo CNT COM INT NAV ONL PHY PRE PUR UNI'**
X-UA-Compatible: IE=EmulateIE7
X-Powered-By: ASP.NET
Location: http://www.microsoft.com
Content-Length: 23
Content-Type: text/html
Cache-control: private
```

If an invalid P3P header is set, or a header that doesn't state policy, Internet Explorer will by default accept the third-party cookies (this doesn't happen in IE9). This is what the P3P header looks like for google.com:

```
P3P: CP="This is not a P3P policy! See http://www.google.com/support/accounts/bin/answer.py?hl=en&amp;answer=151657 for more info."
```

Not mentioned in the Microsoft article is that Facebook are also setting an invalid header ('invalid' may not be the right terminology here, but they are setting a header that does not contain valid privacy policies). This results in Internet Explorer (pre version 9) accepting the third-party cookies.

From facebook.com:

```
$ nc facebook.com 80
GET / HTTP/1.1
Host: www.facebook.com

HTTP/1.1 302 Found
Location: http://www.facebook.com/common/browser.php
**P3P: CP="Facebook does not have a P3P policy. Learn why here: http://fb.me/p3p"**
Set-Cookie: datr=FxdDTzq9li7A7DRTAxVSXaZN; expires=Thu, 20-Feb-2014 04:01:27 GMT; path=/; domain=.facebook.com; httponly
Content-Type: text/html; charset=utf-8
X-FB-Debug: 8V3X/HiIi+1PrEZFy4c8LpavYxpBvnsojJ+pcYyGJUg=
X-Cnection: close
Date: Tue, 21 Feb 2012 04:01:27 GMT
Content-Length: 0
```

The reason Facebook gives for this header in the page [that is linked](http://www.facebook.com/help/?page=219494461411349) from it is:

> The organization that established P3P, the World Wide Web Consortium, suspended its work on this standard several years ago because most modern web browsers do not fully support P3P. As a result, the P3P standard is now out of date and does not reflect technologies that are currently in use on the web, so most websites currently do not have P3P policies.

Microsoft explicitly called out Google for their behaviour but either neglected to mention or didn't investigate Facebook (skeptics may believe that this is because of Microsoft's shareholding in Facebook and their partnerships in search and advertising (HT [ask4n](https://twitter.com/#!/ashk4n/status/171808741816147968))).

If Google is being asked to set proper P3P headers (and it appears that they have already altered at least some of their servers) then Facebook should also he held to the same standard.

<s>We plan on surveying other popular sites to find who else is taking advantage of this loophole in P3P and its implementation to bypass third-party cookie controls in earlier Internet Explorer versions</s>. **Update:** see below. I plan on running a more thorough survey of the top domains.

## Survey of other sites

I looked up the [Shodan Research HTTP archive](http://www.shodanhq.com/research/) to estimate how many other sites are bypassing Internet Explorer privacy controls for third-party cookies by setting an invalid P3P policy.

The database contains all the HTTP headers for the top 10,000 websites according to Alexa. The relevant headers ([P3P](http://www.shodanhq.com/research/infodisc/header/P3P), [p3p](http://www.shodanhq.com/research/infodisc/header/p3p), etc.) show that **almost 500 sites are setting invalid P3P headers – almost a full 5% of the top 10,000 web servers surveyed**.
