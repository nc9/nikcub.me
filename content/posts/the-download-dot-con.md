---
title: The Download Dot-Con
date: 2011-12-08T17:15:33+00:00
excerpt: How CNet's Download.com bundles adware and toolbars with popular open source software, making them no different from the fake download sites they claim to protect against
---

![CNet Download.com bundling adware with open source software installers](/images/posts/download-dotcon.webp)

Fake software downloads are a huge problem on the web. A few weeks ago a non-technical friend called me and asked how to play some Xvid encoded movies he had downloaded. I told him that the best and easiest software to use is VLC Player. He asked if I could send him a copy or a link, and I said “it's ok, just Google for 'VLC download' and you will find it”. Big mistake.

A few days later he was having computer problems. There was a new toolbar in his browser, popups were constantly appearing, his search engine had been switched and the computer was running slow. I went over and removed all the crap that had been installed, ran a spyware scanner and then told him to generally be wary of approving permission requests from applications on the Internet. He then told me that this was _my fault_, because it was 'that stupid VLC program' that had installed the toolbar, the new search engine and the spyware.

VLC? Spyware? Excuse me? Turns out that the top search results for 'VLC download' are littered with fake download sites that take the VLC installer, bundle toolbars and search engines with them, and then make them available to unsuspecting web users. The webmasters are paid affiliate fees for each install.

Over the [past few days](http://insecure.org/news/download-com-fiasco.html) one of the major download mirror sites, CNet's download.com, was in the news. It turns out that they too were taking open source software, bundling toolbars and other software with the installer, and then promoting the downloads as legitimate software – trading on the name of reputable and trusted software such as the Nmap security scanner and the VLC Media Player.

After Nmap author fyodor bought the fake download.com downloads [to public attention](https://seclists.org/nmap-hackers/2011/5), CNet today [issued a statement](https://download.cnet.com/8301-2007_4-57338809-12/a-note-from-sean-regarding-the-download.com-installer/) claiming that bundling useless tools into the installers of open source software was never their policy, and this was all a mistake.

A mistake made with almost every major and popular open source package on the site

As the comments on that thread point out, the bundling will still present on popular open source downloads such as Filezilla and Putty even after the post from CNet was published. The mistake was only that open source applications were included in this bundling racket, non open source applications continue to be bundled with adware.

Other fake download sites that bundle similar toolbars are immediately marked as malware sites and forever regulated to the trash heap of the web. I do not see Download.com as being any different to the thousands of other sites out there that trade on the good name of popular software in order to profit through bundled adware. Download.com shouldn't be given a waiver because they are a large corporation – in this case the business model and the motive is no different to the download scam websites.

From [Download.com Adware and Spyware Notice](https://www.cnet.com/2723-13403_1-461-16.html):

> When it comes to fighting unwanted adware and spyware, CNET Download.com has always been in your corner. During the past few years, we've brought you the best tools and tips in our Spyware Center, and we've maintained strict policies surrounding adware found in our download library. But in the first quarter of 2005, we launched a zero-tolerance policy toward all bundled adware.

[..]

> Although you may come across software from other sites on the Internet that contain adware or spyware, you can feel safe knowing that Download.com has tested software products included in our CNET Download.com listings.

and..

> That means every time you download software from Download.com, you can trust that we've tested it and found it to be adware-free.

This policy was implemented in 2005. It was in response to an uproar at the time about Download.com and bundled adware in downloads. What it meant was that developers couldn't bundle _their own_ adware into their software products. A short time later Download.com launched their download manager. When you click to download a file, instead of getting the original installed, it would download a small Download.com client which would subsequently install the actual product you wanted – but only after a few nag screens prompting you to [install toolbars and other adware](https://www.ghacks.net/2011/08/17/the-cnet-download-com-installer/) (as that post mentions, users who are used to clicking _Next, next, next_ would install it all by default).

Download.com put an anti-adware policy in place, but that was just clearing the path for their own bundled adware and spyware (I consider most toolbars as spyware, since they record every site you visit).

Open source applications being bundled was just an “oops” mistake, but it still continues with other popular software packages (such as the [DivX player](https://download.cnet.com/DivX-Plus-Software/3000-13632_4-10062728.html) I just downloaded and installed).

To be clear: the bundled software is completely useless to most users, is an invasion of user privacy and if thoroughly explained and properly labelled most users would opt-out. The business almost entirely relies on tricking users into installing the bundled software.

There is only one solution to this, and it is that Download.com can not be trusted as a mirror for popular software. It is no different to the fake download sites that trick users into installing toolbars and adware – and like those other sites, Download.com should be blocked and reported as a badware site, at least until they revert to providing a clean mirror of software packages.

I have blocked `download.com` and `download.cnet.com` in my DNS server, and have also reported download.com [to Google as an unsafe badware site](https://www.google.com/safebrowsing/report_badware/), and I suggest you do the same. It shouldn't take too many reports until either Google investigate or Download.com opt to completely clean up.

**Note:** you can access clean installs from download.com if you signup for an account on the site. But who the hell does that.
