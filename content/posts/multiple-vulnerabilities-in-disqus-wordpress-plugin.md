---
title: Multiple Vulnerabilities in Disqus WordPress Plugin
date: 2014-08-12T21:08:35+0000
excerpt: Disclosure and fixes for a number of bugs in the Wordpress plugin for the popular Disqus commenting system
---

**Vendor**: [Disqus for WordPress](https://www.disqus.com/)

**Affected versions**: up to v2.7.5

**Patched:** [v2.7.6 release](https://wordpress.org/plugins/disqus-comment-system/other_notes/)

**Exploit:** [Manage.php CSRF+XSS admin exploit](https://gist.github.com/nikcub/cb5dc7a5464276c8424a)

[Disqus](https://disqus.com/) is an extremely popular third-party commenting system used on blogs and media sites. The [disqus plugin for WordPress](https://wordpress.org/plugins/disqus-comment-system/) has been installed over a million times and is the [15th most popular overall](https://wordpress.org/plugins/browse/popular/) WordPress plugin.

I recently performed a penetration test where the website was running the latest version with a small number of plugins, one of which was Disqus – which lead me to dive into the code. Grepping the codebase for POST and GET parameters pretty quickly yielded code blocks where parameters were being passed and output without any filtering.

## Issue 1: CSRF in Manage.php

In the file `manage.php` which handles the plugin settings there is this block of code (line 60 onwards):

The parameters `disqus_replace`, `disqus_public_key` and `disqus_secret_key` are being passed to WordPress’s `update_option` function directly with no filtering. The [documentation for update_option](https://codex.wordpress.org/Function_Reference/update_option) says that it will take any value passed to it and store it in the database. It is up to the plugin author to filter and validate variables here, since there are cases where you want to store HTML or other types of raw data.

Further down in `manage.php` we can see that the options are read out of the database again using `get_option` (line 245):

These variables are then printed back out on the page in the form, where they are filtered properly:

They are only output there after being passed through the WordPress `esc_attr` function which will string replace HTML characters and escape them.

But at the very bottom of the page there is a ‘debug’ feature that dumps all the settings into a `textarea`. This is used to troubleshoot the plugin, where Disqus support can ask a user to simply copy/paste what is in the textarea to find problems.

In the debug area all of these variables are dumped out into the textarea with no filtering. The relevant code (line 537):

We can see that the loop will go through each Disqus option and then dump the value unfiltered. To exploit this, we go back and pick any variable and pass in an XSS exploit.

To exploit this, we need our victim to hit a page we setup where the exploit will be injected via CSRF. Here is a pretty standard example exploit:

We set this HTML page up on our own server, or better yet get it somehow on the same domain as the WordPress install (which means we can IFRAME it invisibly since WordPress sets X-Frame-Options).

That exploit payload, `&lt;/textarea&gt;&lt;script&gt;alert(1);&lt;/script&gt;&lt;textarea&gt;` will close up the textarea and then inject a script that will popup an alert as a test.

This is what it looks like:

<img alt="Disqus WordPress plugin XSS vulnerability demonstration" width="800" height="600" src="/images/posts/Disqus-20-E2-80-B9-20nikcub-20test-20-E2-80-94-20WordPress.webp"/>

The last little touch on our exploit is that we trigger the form submit on pageload. I successfully utilized this exploit against a live environment as part of a pen test via a spearphish email to an administrator (my exploit was a little more sophisticated and the payload useful).

## Issue 2: No nonce check on setting reset and delete

This one is less serious, but on the same advanced settings page for the plugin the submitted nonce isn't checked meaning we can use CSRF to trigger the 'reset' function or to delete any of the disqus plugin options.

Exploit here is simple again, take the last exploit and remove all the fields and add one for 'reset'. Deliver to a victim and we can trigger the reset or a delete action.

The form includes a nonce, but it isn't being checked on submit. The `wp_verify_nonce` function ([documentation](https://codex.wordpress.org/Function_Reference/wp_verify_nonce)) should be called on submit.

## Issue 3: Unfiltered parameter in upgrade script

The `step` parameter is stored unfiltered and then echo'd out, resulting in an XSS. Code path can be hit when Disqus install is out of date.

```php
<?php echo dsq_i('Upgrade Disqus Comments'); ?>
```

## Dislosure Timeline

**June 9th 2014** - Reported to security@disqus<br/>
**June 24th 2014** - Fixed in [Disqus for WordPress v2.7.6](https://wordpress.org/plugins/disqus-comment-system/other_notes/)
