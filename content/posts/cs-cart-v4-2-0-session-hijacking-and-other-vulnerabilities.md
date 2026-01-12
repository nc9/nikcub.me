---
title: CS-Cart v4.2.0 Session Hijacking and Other Vulnerabilities
date: 2014-08-07T01:00:19+0000
excerpt: How weak session ID generation using uniqid() in CS-Cart allows session hijacking through targeted brute-force, plus a frustrating disclosure timeline
---

**Vendor**: [CS-Cart](https://www.cs-cart.com/)

**Affected versions**: up to v4.2.0

**Patched:** v4.2.1 released

[CS-Cart](https://www.cs-cart.com/) is a semi-popular open source e-commerce shopping cart application. It contains a homebrew session management system that utilizes an insecure source of randomness to generate session tokens. The poor source of randomness combined with other bugs makes it possible to hijack an administrators session with a small brute-force window.

The exploit involves a number of steps, and i’ll set them all out below along with background on each step.

## Part 1: Weak Session ID Generation

In the file `./app/Tygh/Session.php` line 49:

A session key based on `uniqid`, which is not cryptographically secure. This is what [the PHP manual](https://au1.php.net/uniqid) says about `uniqid`:

> **Warning** This function does not create random nor unpredictable strings. This function must not be used for security purposes. Use a cryptographically secure random function/generator and cryptographically secure hash functions to create unpredictable secure IDs.

What might be understated is just how non-random `uniqid` really is. Here is the [relevant source code](https://github.com/php/php-src/blob/af6c11c5f060870d052a2b765dc634d9e47d0f18/ext/standard/uniqid.c#L44-L87) for the PHP function:

It turns out `uniqid` is just a call to `gettimeofday` and formatted back in hex. The parameter passed to `uniqid` is not a seed, it is just a prefix. Passing `time()` to `uniqid()` effectively just prints the time twice.

To better understand just how non-random this is, here is a pure PHP implementation of `uniqid` to make it a little easier to understand:

Example output:

CS-Cart generating `md5(uniqid(time()))` as a session ID is simply the md5 hash of: the current time as an integer in seconds plus the current time as a hexadecimal number plus the current number of usecs in hex.

You can probably see already where this is heading. There are 999,999 usec’s per second, so if we can work out at what time a session was generated within a second we can take a shot at brute-forcing it.

Exploiting this will require finding a way to force the user into recreating a session or figuring out when their session was created.

## Part 2: Regenerating the Administrators Session

In the same `Session.php` file in the `start` method that is called on every request there is this little block of code:

The `$request` variable simply stores all the applications request variables (it mixes GET and POST vars into one array, replicating PHP’s `$_REQUEST`).

What this code says is – if there is a request variable that is the same name as the session name, then set the value of the session to the value of the request.

We don’t know the value, but what this allows an attacker to do is to set the session variable to an _invalid_ value, thus killing the session.

The session name is unique to each install, but is easy to retrieve by simply visiting the admin portal login page and checking the name of the cookie.

In my example install the name of the cookie is `sid_admin_e66cd`.

We can then craft a URL that when visited will log the admin user out since it isn’t a valid session (there is also a header inject bug here):

`http://cscart.local/admin.php?sid_admin_e66cd=a`

The value of the cookie doesn’t matter. When an administrator visits that URL they will be logged out of their session and sent back to the login page.

We now have a way to force the admin user to re-crate the session. If we send the admin that link and hope they log in again we can narrow down the search field for the brute-force.

## Part 3: User-Agent Checking

One problem with exploiting it is that the CS-Cart application stores the administrators user-agent in the session and checks it on every request. If the user-agent does not match the user agent stored for the user then the session is expired.

There is a way around this – we simply wrap the URL around a URL shortener that we control. That gives us not only the user-agent but also the correct UTC (or relevant timezone) datetime where we can begin our session search from.

I have my own evil shortener that I use – it is hosted on a couple of innocent looking domain names. I crafted the admin logout URL, shortened the link to look like an image and then sent a spearphish email to the target admin:

> Hi, I was wondering if you have this in stock:

The URL would redirect to log them out on the CS-Cart admin backend. Hopefully the admin user would login again after seeing their session logout. Looking at the logs on the shortener, we now have the exact time the admin clicked the link and their exact user-agent.

## Part 4: The exploit

We now have all the components we need to brute-force the session. Here is a simple python exploit (I used a multithreaded version that uses gevent)

[Exploit on GitHub](https://gist.github.com/nikcub/a0686e48ddeb943fd610)

Suggested improvements would be to distribute the load across more machines. I successfully hijacked a session using a small number of servers.

## Issue #2: secret_key is not random.

During install CS-Cart generates a secret key that is used in encryption routines and other security routines. The generation method is not random and is rather weak.

Here is the source:

`str_shuffle` uses `rand`, which is also not secure.

## Disclosure Timeline

**10th June 2014** – Reported to CS-Cart<br/>
**17th June 2014** – Bugs confirmed by CS-Cart, offered a free license of their software. I replied asking when the fix will be out – no response.<br/>
**20th June 2014** – Sent them an email telling them I have more bugs – no response.<br/>
**21st July 2014** – [CS-Cart announce v4.2.1](https://blog.cs-cart.com/2014/07/21/cs-cart-4-2-1-released-new-styles-e-mail-marketing-and-more/) with no mention of security patches, bury the details [in the changelog without mentioning security](https://www.cs-cart.com/changelog421.html) (no credit).<br/>
**7th Aug 2014** – I find out they patched the bugs weeks ago only because I checked the latest version myself.
