---
title: Analyzing the FBI’s Explanation of How They Located Silk Road
date: 2014-09-07T18:55:24+0000
excerpt: A technical analysis of the FBI's claims about how they located Silk Road's server, showing their explanation doesn't match how Tor hidden services work
---

The first incarnation of online drug marketplace [Silk Road](<https://en.wikipedia.org/wiki/Silk_Road_(marketplace)>) was shutdown in October 2013 resulting in the arrest of Ross Ulbricht. In [the indictment](https://www.scribd.com/doc/235866098/USA-v-Ross-Ulbricht) the Department of Justice contend that Ulbricht was Dread Pirate Roberts, the owner and administrator of Silk Road. The case has been in pretrial for some time now, with defense lawyers contesting many elements as part of a large and broad [motion to dismiss](https://www.scribd.com/doc/215745393/USA-v-Ulbricht-motion-to-dismiss-charges) ([subsequently denied](https://www.scribd.com/doc/233234104/Forrest-Denial-of-Defense-Motion-in-Silk-Road-Case)) and other filings.

The marketplace was hosted as a hidden service on [Tor](https://www.torproject.org/), a distributed network that provides a layer of anonymity for web and other traffic on the internet. Edward Snowden’s leaks revealed that the NSA [target Tor](https://www.theguardian.com/world/2013/oct/04/tor-attacks-nsa-users-online-anonymity) users and that the agency [has struggled](https://www.theguardian.com/world/interactive/2013/oct/04/tor-stinks-nsa-presentation-document) to deanonymize users on the network.

One of the big outstanding issues was how the FBI managed to uncover the real IP address of the server hosting the Silk Road. The indictment is intentionally vague on the details of how the server was discovered, and the issue is important since a large number of users ([numbering in the millions](https://metrics.torproject.org/users.html)) rely on the Tor software network to protect their identity.

Last month Ulbricht’s lawyers filed a motion seeking to uncover details on how the FBI located the server. The core of the issue for the defense is if the FBI violated Ulbricht’s Fourth Amendment right to privacy in tracking down the server IP address by using any unlawful techniques or a method that would have required a warrant. If the evidence is found to have been obtained unlawfully, then much of the case against Ulbricht would collapse as all subsequent evidence discovered as a result of the server being uncovered would be ruled inadmissible.

On Friday [Wired reported](https://www.wired.com/2014/09/the-fbi-finally-says-how-it-legally-pinpointed-silk-roads-server/) that the FBI had responded with their own filing detailing how they uncovered the server:

> The FBI claims to have found the server’s location without the NSA’s help, simply by fiddling with the Silk Road’s login page until it leaked its true location.

The government response consists of first [the DOJ filing](https://www.scribd.com/doc/238796613/Silk-Road-Prosecution-4th-Amendment-Rebuttall), and then the [affidavit from the FBI tech team](http://ia700603.us.archive.org/21/items/gov.uscourts.nysd.422824/gov.uscourts.nysd.422824.57.0.pdf) (PDF). The affidavit is more interesting since it delves into the “tech” of how the server was uncovered. Breaking it down:

The first three sections go into the background and experience of the team investigating. The fourth briefly explains what Tor is, its purpose and how it works. The fifth section opens with:

> In order for the IP address of a computer to be fully hidden on Tor, however, the applications running on the computer must be properly configured for that purpose. Otherwise, the computer’s IP address may “leak” through the traffic sent from the computer. See, e.g., Tor Project, Guide on How to Tor-ify Various Applications, https://trac.torproject.org/projects/tor/ wiki/doc/TorifyHOWTO (“Tor does not protect all of your computer’s Internet traffic when you run it. Tor only protects your applications that are properly configured to send their Internet traffic through Tor.”).

This is true – there are many, many ways that a Tor configuration can leak and reveal details about a user that could lead to them being identified. The [cited wiki page](https://trac.torproject.org/projects/tor/wiki/doc/TorifyHOWTO) on the Tor project website lists a number of the potential leaks. One problem – the page they link to and cite refer to Tor _clients_ – not hidden services. The leak issues and attack vectors on that page are for end users of Tor browsing the web or hidden services (it goes into how to use an isolating proxy, how to torify certain applications such as email and irc clients, etc.), they don’t apply to Tor hidden services and servers.

The only page for hidden services is [on the main Tor project website](https://www.torproject.org/docs/tor-hidden-service.html.en), and all it says about “leaks” for servers is:

> You need to configure your web server so it doesn’t give away any information about you, your computer, or your location. Be sure to bind the web server only to localhost (if people could get to it directly, they could confirm that your computer is the one offering the hidden service). Be sure that its error messages don’t list your hostname or other hints. Consider putting the web server in a sandbox or VM to limit the damage from code vulnerabilities.

The reason why there isn’t a longer page on hidden service leaks is because there isn’t much to add. Tor operating as a hidden service doesn’t leak information directly, the risk is at the application layer. The advice found at the Tor website, as well as in similar tutorials such as [at the Whonix project](https://www.whonix.org/wiki/Hidden_Services), are all about setting up your web server so that it doesn’t do anything silly – such as include its IP address in the server signature. This is an entirely separate class of “leaks” to those described on the Tor wiki page cited in the FBI affidavit.

The affidavit goes on to say:

> During the course of the FBI’s investigation of the Silk Road website, the SR Server was located by myself and another member of the CY-2 squad of the FBI New York Field Office as a result of such a leak.

They couldn’t have been using a leak described in the cited Tor wiki page, since they only apply to Tor clients. The FBI indictment and affidavits make no mention of the Silk Road server being used as a client, but it does describe _other_ servers that Silk Road administrators were using as either Tor clients or bridges. The first step in setting up a hidden service on Tor is to disable the client functionality (and even were it left enabled, it would only be listening on localhost as default and would not be used).

Further, onto sections 6, 7 and 8 – :

> 6. The IP address leak we discovered came from the Silk Road user login interface.

These are the key pieces of information – the actions the agents took to uncover the IP address. This description raises more questions than it answers.

Anybody with knowledge of Tor and hidden services would not be able to read that description and have a complete understanding of the process that the agents followed to do what they claim to have done. Were the Silk Road site still live today, and in the same state it was as in back in June 2013 when the agents probed the server, you wouldn’t be able to reproduce or recreate what the agents describe in the affidavit.

This is why there are so many different theories now on how they achieved what they claim to have achieved. The first conclusion to come out of this filing was the [“leaky CAPTCHA”](https://krebsonsecurity.com/2014/09/dread-pirate-sunk-by-leaky-captcha/) theory. This theory does not stand up to scrutiny because the Silk Road image CAPTCHA was hosted on the same server and at the same hidden URL as the Silk Road website. It was not, contrary to some reports, a third-party CAPTCHA. The CAPTCHA image was produced by a script that sat alongside the login and authentication endpoints.

The CAPTCHA being hosted on the same server and endpoint as the main Silk Road application caused the site problems. Since generating a CAPTCHA is resource intensive, there was a DoS attack against Silk Road which did nothing more than continuously request CAPTCHA images. The site was later modified to use cached versions of the CAPTCHA images, but these too were served from the same host and onion as the web application.

_Note: I would cite more sources here, but a lot of this is from my own memory. I spent a lot of time investigating and testing the security of Silk Road (for sport) and became familiar with both its architecture and operation over the entire duration that the first site was up. I have Burp sessions of Silk Road stored somewhere which I will have to dig up – if anybody else has any screenshots or mirrors of Silk Road from this time i’d love to [hear from them](/contact)._

The idea that the CAPTCHA was being served from a live IP is unreasonable. Were this the case, it would have been noticed not only by me – but the many other people who were also scrutinizing the Silk Road website. Silk Road was one of the most scrutinized sites on the web, for white hats because it was an interesting challenge and for black hats since it hosted so many bitcoin (with little legal implication if you managed to steal them).

The second theory, that the agents “discovered” the real IP address by just looking at packet captures produced by a sniffer is similarly impossible. This also would have been discovered much sooner and noticed by most of the internet very quickly.

There is another related hole in the FBI theory related to the “packet sniffer.” If you are observing a hidden site on Tor, it means you are routing all of your traffic in that session over the Tor network (using your local SOCKS or HTTP proxy server). Even in the hypothetical case where – for some unrealistic reason – the Silk Road hidden site was including an image on an external server by referencing its IP address or hostname, **the agents would still observe this traffic as having come from Tor**. There is no magic way that the traffic from a real IP embedded within the HTML of a hidden service would find its way directly to a client without passing over the Tor network and through Tor nodes. Were this the case, **it would be a huge vulnerability in Tor**, as it would allow the administrator of a hidden site to uncover visitors by including an element that is served directly to the client over clearnet (thankfully it isn’t and this doesn’t work – try it).

No matter how much the agents entered “miscellaneous entries” into the login form fields, and no matter what they caused the server to respond, at no time would it have been possible for a layer 3/4 sniffer to see the real IP address – it only ever would have seen Tor nodes, even if it had been accessing the real IP address.

Filling the login form with junk could only ever have altered what appeared in the application layer, and it is at the application layer that the FBI uncovered the IP address.

## A More Likely Scenario

Since the FBI explanation doesn’t hold up to the IP address being revealed at lower layers, and since “typing in miscellaneous entries into the username, password, and CAPTCHA fields” (aka fuzzing) could only alter application-layer data, we need to find an explanation for what the FBI did that fits both the reality of how Tor, hidden services and the Silk Road application work and what the FBI are describing in their legal affidavit.

The FBI affidavit wouldn’t mention fuzzing if it wasn’t required to, so this must play an important part of their method. We know that the Silk Road server didn’t simply volunteer its IP address to every visitor, but we do know that the Silk Road application suffered from numerous security flaws during its lifetime.

Ross Ulbricht was not an experienced programmer and was learning how to develop web applications and write PHP at the same time as he was implementing the Silk Road web application. He (according to the DOJ) [posted a question](http://antilop.cc/sr/img/2013_03_16_stack_overflow_question.png) to Stack Overflow asking how to connect to a hidden service using PHP and Curl. The lax security of the web application lead to Silk Road being hacked a number of times and the personal data of users and vendors being leaked (DPR paid off at least one hacker who threatened to release data).

A much more plausible explanation is that the FBI discovered a security exploit or information leak in the login page, in the same way a number of other people discovered similar security holes or information leaks in both the login page and the Silk Road application itself.

There is a history of users reporting such security exploits and information leaks in Silk Road on various forums. On the [27th of March 2013 a user posted on reddit “WARNING: The Silk Road Revealed it’s Public IP Last Night”](https://www.reddit.com/r/SilkRoad/comments/1b1lvy/warning_the_silk_road_revealed_its_public_ip_last/):

> I am a penetration tester by trade, and while I do not use SR, I do occasionally conduct informal tests of the security of various Tor Hidden Services.

I referenced that thread in [my answer on Stack Exchange](https://security.stackexchange.com/a/43280/31518) on how the Silk Road server may have been discovered shortly after the site was taken down.

“If you know where to look”, as mentioned in the comment, is a suggestion that a hidden URL was found, or the login form was forced to error and produce some debug output.

Further, on the 3rd of May 2013 there was a similar warning from another user on reddit, [“Should we be worried? Showing on login page”](https://www.reddit.com/r/SilkRoad/comments/1dmznd/should_we_be_worried_showing_on_login_page/)

![Reddit post showing PHP server variable dump on Silk Road login page](/images/posts/sr_reddit_screnshot.webp)

If this isn’t familiar to you, it is a `var_dump` of PHP’s `$_SERVER` variable. It would suggest somebody was debugging a problem on the server and editing live code, using the `var_dump` function to debug a problem (and inexperienced programmer would both edit on a live server and use `var_dump` to debug).

Further, these two dates and IP leaks are supported in the FBI’s own affidavit. In a footnote they mention:

> After Ulbricht’s arrest, evidence was discovered on his computer reflecting that IP address leaks were a recurring problem for him. In a file containing a log Ulbricht kept of his actions in administering the Silk Road website, there are multiple entries discussing various leaks of IP addresses of servers involved in running the Silk Road website and the steps he took to remedy them. For example, a March 25, 2013 entry states that the server had been “ddosd” – i.e., subjected to a distributed denial of service attack, involving flooding the server with traffic – which, Ulbricht concluded, meant “someone knew the real IP.” The entry further notes that it appeared someone had “discovered the IP via a leak” and that Ulbricht “migrated to a new server” as a result. A May 3, 2013 entry similarly states: “Leaked IP of webserver to public and had to redeploy/shred [the server].” Another entry, from May 26, 2013, states that, as a result of changes he made to the Silk Road discussion forum, he “leaked [the] ip [address of the forum server] twice” and had to change servers.

Ulbricht made his diary entry on the 25th of March, the first leak was posted to reddit on the 27th. The second leak was posted to reddit on the 3rd of May, the exact date that Ulbricht notes in his diary.

The FBI agents state that their investigation was carried out “In or about early June 2013”, and that they had the IP by the 12th of June – since that is when they sent the request for a mirror of the server to be made by the authorities in Iceland (where the server was located).

The FBI investigation and uncovering of the IP address was taking place at the exact same time bugs that were known to expose the IP address of Silk Road were present on the site. A more likely scenario for how the FBI uncovered the real IP address would thus be that they either saw the debug information, or – more likely – took advantage of a security vulnerability in the login page and forced the server to output its `$_SERVER` variable (which includes the real IP (although it shouldn’t)).

This would explain why the FBI included the statement about “typing in miscellaneous entries into the username, password, and CAPTCHA fields”, because they needed to enter an exploit command to prompt the server to either dump or produce the IP address variable.

In this scenario, the description of packet sniffers and “inspecting each packet” is all a distraction from what the FBI really did. Technically, saying that a packet sniffer revealed the true IP address of the server is true – what isn’t mentioned is the packet sniffer was picking up responses from a request to the login page that was forcing it to spit out the IP address as part of a bug.

The FBI have good reason to not mention any bugs or forcing the server to do anything, and to pretend that they simply picked up the IP address from the wire, since such actions would raise concerns about how lawful their actions in uncovering the IP address were. What we do know is that their description of “packet sniffing” for the IP through a “leak” is impossible.

_Thanks to: [harisec](https://www.twitter.com/harisec), [thegrugq](https://www.twitter.com/thegrugq) and the ever useful [Silk Road timeline](http://antilop.cc/sr/) by [moustach](https://twitter.com/lamoustache/) for links and tips._

## Addendum

**1.** If you still believe that the server was discovered in the way the FBI described it – _try it_. I did. I setup a virtual machine with a web server running a Tor hidden server. I then accessed the hidden server over Tor and looked at the traffic. No matter how much I intentionally misconfigured the server, or included scripts from clearnet hosts, I _never_ observed traffic from a non-Tor node or a “real” IP address.

**2.** Many enquiries in various comment threads about how best to setup a hidden service so that application layer bugs won’t expose your real IP address. The answer is to host the web application in a virtual machine that is on a private network isolated behind a gateway that will only forward Tor traffic. This also works for Tor clients (to prevent malware based attacks such as the that [used by the FBI](https://www.wired.com/2013/09/freedom-hosting-fbi/)). I’ll likely write up details for both client and server isolated VM setups in the future.
