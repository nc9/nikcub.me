---
title: Securing Blockchain.info Users with Tor and SSL
date: 2014-12-03T16:13:03+0000
excerpt: Helping Blockchain.info become the second site after Facebook to offer a Tor hidden service with a CA-signed SSL certificate, protecting users from MITM attacks
---

Over the past couple of weeks there has been a marked increase in the number of man-in-the-middle (MITM) attacks against Tor users of web based Bitcoin wallet provider Blockchain.info. One user reported [63 bitcoin](https://bitcointalk.org/index.php?topic=875805.0) stolen, and there were [many](https://www.reddit.com/r/Bitcoin/comments/2nrf12/my_blockchaininfo_account_was_hacked_thanksgiving/) [other examples](https://www.reddit.com/r/Bitcoin/comments/2nkias/this_is_a_list_of_rbitcoin_users_who_had_their/) as the thefts continued [despite warnings](https://twitter.com/blockchain/status/522454637115617280) to users. The attacks were so successful that Blockchain resorted to blocking all traffic to the wallet service from Tor exit nodes.

I've been working with Blockchain since Saturday to implement a number of security measures to better protect users. The main result of these efforts is that today we are announcing that Blockchain is now available as a hidden service on Tor with a signed SSL[^1] certificate (provided by [DigiCert](https://www.digicert.com)) and HTTPS enforced across the site. The address is `https://blockchainbdgpzk.onion/`.

Blockchain are now only the second site to offer an alternate service on the Tor network with a signed certificate after Facebook [announced their own](https://www.facebook.com/notes/protect-the-graph/making-connections-to-facebook-more-secure/1526085754298237) hidden service last month.

<img alt="Blockchain.info hidden service with signed SSL certificate in Tor browser" src="/images/posts/blockchain-tor.webp" width="800" height="600"/>

Along with the hidden service and signed certificate, Blockchain has switched to HTTPS across the site and enforced secure connections on both the clearweb domain and the onion site with [Strict Transport Security](https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security) (HSTS) (which will be preloaded for the clearweb domain in all major browsers, and hopefully also for the onion domain), and will also implement dynamic public key pinning with Public Key Pinning ([HPKP](https://tools.ietf.org/html/draft-ietf-websec-key-pinning-01)).

With an authenticated hidden service Blockchain users are able to access their Bitcoin wallets with the added anonymity of Tor while avoiding exit nodes. For users of the regular clearweb Blockchain service the addition of HSTS and HPKP provide additional guarantees against MITM attacks and rogue or stolen site certificates.

## MITM Attacks and SSL Stripping

MITM attacks against users on Tor are simple to execute and remarkably effective. The type is attack is referred to as SSL stripping, where the MITM would intercept requests to an HTTPS service and downgrades the connection to plain unencrypted and unauthenticated HTTP. If the user doesn’t notice the switch to HTTP, or if the browser doesn’t enforce HTTPS, then any data or credentials submitted can be read and stored by the MITM.

This technique was detailed and presented by Moxie Marlinspike in a [2009 talk at the Black Hat security conference](https://www.youtube.com/watch?v=MFol6IMbZ7Y), where he also released a tool for the purpose called [sslstrip](http://www.thoughtcrime.org/software/sslstrip/). It has been five years since the presentation and the release of the tool yet awareness of SSL stripping attacks amongst users is low and this type of attack is incredibly underrated.

In an SSL stripping attack, the attacker first inserts their machine as a proxy between the victim and target website. This can be achieved with arp spoofing on a LAN or WiFi network, with DNS poisoning, by seizing a VPN server or HTTP proxy or by running a Tor exit node. Once inserted on the path between the victim and the connection to a web server, the sslstrip attack will intercept requests to an HTTPS based service and proxy them back to the user over HTTP.

<img alt="Diagram showing how SSL stripping inserts a proxy between victim and server" src="/images/posts/BlackHat-DC-09-Marlinspike-Defeating-SSL.pdf-20-page-2025-20of-2099-.webp" width="800" height="600"/>

It is an attack type that relies on the user not noticing that their connection is no longer secured. One of the most common SSL stripping techniques is to set a lock icon as the fav icon for the website to fool the user into not noticing they aren’t on a real HTTP page. Here is an example of the Gmail homepage with sslstrip placing a lock icon as a favicon, note the _HTTP_ URL:

<img alt="Gmail login page with sslstrip showing fake lock favicon over HTTP" src="/images/posts/BlackHat-DC-09-Marlinspike-Defeating-SSL.pdf-20-page-2069-20of-2099-.webp" width="800" height="600"/>

(Note: The last two slides are from Moxie’s [Black Hat talk](https://www.youtube.com/watch?v=MFol6IMbZ7Y), which is very accessible and worth seeing. His [followup talk](https://www.youtube.com/watch?v=ibF36Yyeehw) with details of other stripping techniques is also recommended, as is [Moxie’s blog](http://www.thoughtcrime.org).).

SSL Stripping is responsible for a large number of the attacks against Blockchain users, particularly those accessing the service over Tor. The recommended action for users it to always check the validity of their connection to the web server and to make sure it is secure and that the certificate they are presented validates (you can check this in most browsers by clicking on the (real) secure lock icon).

## The 10-character Address

`blockchainbdgpzk.onion` is a 10-character vanity onion address. It took around 40 hours to find using a large cluster of GPU instances on Amazon Web Services running [Scallion](https://github.com/lachesis/scallion). Utilizing spot instances across a variety of regions and zones over the weekend kept the costs reasonable.

Thank you to Scallion developer Eric Swanson for providing a great tool and for answering some of my queries. The total hashrate achieved in the cluster was just under 10,000 MH/s

I will be publishing my AMI shortly, if you need assistance in finding a vanity onion address for your own Tor hidden service [get in touch](/contact).

## CA Signed Onion Addrees

We worked with [DigiCert](https://www.digicert.com) to get a certificate containing the new onion address for Blockchain signed (thank you to Jeremy and the team there, they leapt into action and helped us out when we found ourselves in an urgent situation). DigiCert also signed the certificate used by Facebook in their hidden service. Since .onion is a pseudo-TLD Tor hidden service host names cannot be specified as the common name in the certificate. With Facebook and Blockchain certificates were generated with the onion addresses specified in the Subject Area Name (SAN) field.

One problem with this approach is that the [CA/Browser Forum](https://cabforum.org/) (CAB), a body comprised of browser manufacturers and certificate authorities that set certificate standards, decided to [deprecate the use of local names in CA signed SAN certificates](http://www.networking4all.com/en/ssl+certificates/faq/change+san+issue/) (details and guidelines [from CAB in this PDF](https://cabforum.org/wp-content/uploads/Guidance-Deprecated-Internal-Names.pdf)). As it isn’t a formal TLD, .onion is considered a local name, and with local names in SAN certificates no longer being valid from the 1st of November 2015 it means certificates signed for .onion addresses will also no longer be valid.

Hopefully between now and the November 2015 expiry date a solution will be reached, as .onion _clearly_ isn’t a local name and should be a recognized TLD. There are a number of reasons why .onion has yet to be recognized, not least of which are the [fees sought by ICANN for new TLD registration](https://trac.torproject.org/projects/tor/ticket/6116) – a figure of approximately $200,000.

## Chromium Verification Failure

Google has surged ahead with local name signed certificate deprecation by not validating them in Chromium. This means the Facebook and Blockchain hidden services are displayed as broken HTTPS connections despite all the certificates validating.

<img alt="Chrome showing broken HTTPS for onion address with signed certificate" src="/images/posts/Screen-20Shot-202014-12-04-20at-202.00.01-20AM.webp" width="800" height="600"/>

Chrome will only validate signed certificates for hostnames that belong to a TLD or country-level domain that is listed in the [public suffix list](https://publicsuffix.org/). This is a sound security decision, the problem is that .onion needs to be recognized as a proper TLD. If it isn’t recognized as a TLD, I hope that the browsers will include it as an exception.

## Encrypted Services

Alternate services on Tor don’t need the server anonymity that hidden services provide. The location of the server in cases such as Facebook and Blockchain is no secret, so the Tor circuit could cut off the last hops to the hidden service and speed things up. Turns out there is an [old draft proposal](https://gitweb.torproject.org/torspec.git/blob_plain/HEAD:/proposals/ideas/xxx-encrypted-services.txt) for exactly that – it is referred to as Encrypted Services. With more alternate services popping up on Tor now would be a good time to dust that proposal off and investigate finishing the spec and getting it implemented.

## Protocol Upgrade

[HTTPSEverywhere](https://www.eff.org/HTTPS-EVERYWHERE) is a browser plugin from the EFF that automatically redirects web requests to secure versions of a website if it is available. It is built into the Tor browser by default. There is a fork of the plugin called [Darkweb Everywhere](https://github.com/chris-barry/darkweb-everywhere) which redirects clearweb visits to an equivalent onion site if one is available.

As with HTTPSEverywhere, the plugin achieves this by maintaining [an index of rules](https://github.com/chris-barry/darkweb-everywhere/tree/master/src/chrome/content/rules) listing each website and it’s onion address. There are a number of downsides with this approach – namely maintaining the rule set and then collating evidence of ownership and an audit trail for each onion website.

An approach that has been suggested on [one of the Tor mailing lists](https://lists.torproject.org/pipermail/tor-talk/2014-May/032907.html) is for websites to return an HTTP header specifying the location of the onion address for their alternate service.

The idea is that a Tor-capable user agent visiting `facebook.com` or `blockchain.info` would be automatically redirected to `facebookcorewwwi.onion` or `blockchainbdgpzk.onion` respectively.

It would be preferable if configuration and maintenance of a clearweb to onion redirect was with the website operator, similar to the way HSTS works with the redirect being established and then cached. There are some privacy and security implications that need to be considered, and Facebook may find it difficult to justify returning an additional HTTP header a few hundred million times per day for the benefit of a handful of users (as pointed out by Alec Muffett [on Twitter](https://twitter.com/alecmuffett/status/538991864582782976)).

We are planning on coming up with a solution that would redirect Tor users to onion sites (or i2p users to eepsites – keeping it protocol neutral) and rolling it out. If you have any ideas or proposals for a protocol that could work, [get in touch](/contact) on Twitter or on email.

## Tor Use Cases

In the media Tor is most often associated with drug markets, the darkweb and whistleblowers, but there are [many other use cases](https://www.torproject.org/about/torusers.html.en) and applications for the network. It pairs perfectly with Bitcoin (although you [shouldn’t run](http://orbilu.uni.lu/bitstream/10993/18679/1/Ccsfp614s-biryukovATS.pdf) a full p2p Bitcoin client on Tor), can provide user anonymity and access to web services where they may otherwise be blocked or intercepted.

I've seen a large amount of interest from various parties in providing alternate services on Tor, and i'm going to be working on bringing more businesses and web services onto the network. If you're interested in learning more about how Tor could work for you, want to setup your own services or would like help in finding the right onion address or configuring hidden services [get in touch](/contact).

[^1]: with SSL 3.0 now mostly gone, technically it is TLS – although I find it difficult to get used to referring to it as that.
