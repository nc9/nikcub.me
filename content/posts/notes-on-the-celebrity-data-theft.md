---
title: Notes on the Celebrity Data Theft
date: 2014-09-02T19:40:28+0000
excerpt: An in-depth look at the underground networks behind "The Fappening" - how they operate, the techniques used to compromise iCloud accounts, and Apple's security weaknesses
---

An interesting aspect of information security is how periodically it collides with other industries and subcultures. With more information than ever being stored and shared online and on connected devices hacking stories are frequent and are mainstream news. This was the case yesterday as dozens of celebrities fell victim to hackers who leaked hundreds of private photographs and videos stolen from web based storage services.

This incident is now known as "The Fappening" - a large leak of [celebrity iCloud data and photos](https://en.wikipedia.org/wiki/ICloud_leaks_of_celebrity_photos)

The summary of the story is that a number of personal and private nude images from high profile celebrities started appearing on online image boards and forums – most notably on anon-ib, 4chan and reddit.

The first pictures were posted nearly a week ago, but didn’t get much attention since they were being ransomed (censored previews being shared in the hope somebody would purchase them). It was only after a number of intermediaries purchased the images and posted complete nudes in public forums that the story exploded.

At least a dozen celebrities were affected by the photo dumps, with over 400 individual images and videos. A list of celebrity names published anonymously, and serving as something akin to a sales brochure, suggests that over 100 have had their personal data compromised.

After this story broke I spent some time immersed in the crazy, obsessive subculture of celebrity nudes and revenge porn trying to work out what they were doing, how they were doing it and what could be learned from it.

**1.** What we see in the public with these hacking incidents seems to only be scratching the surface. There are entire communities and trading networks where the data that is stolen remains private and is rarely shared with the public. The networks are broken down horizontally with specific people carrying out specific roles, loosely organized across a large number of sites (both clearnet and darknet) with most organization and communication taking place in private (email, IM).

**2.** The goal is to steal private media from a targets phone by accessing cloud based backup services that are integrated into iPhone, Android and Windows Phone devices. To access the cloud based backup requires the users ID, password or an authentication token.

**3.** The roles in the networks break down as:

1. Users who scour Facebook and other social media looking for targets and collecting as much information as possible. Data collection includes utilizing public record services and purchasing credit reports. Obtaining data on a target includes setting up fake profiles, friending or following friends of the target, being persistent with extracting information that might help answer secret questions, approaching friends of the target, etc.
1. Users who use the target data to retrieve passwords or authentication keys. There are numerous methods here and most have tutorials available online. The most common are RATs, phishing, password recovery and password reset. RATs are simply remote access tools that the user is either tricked into installing via private messages or in an email (link or an attachment) or that someone close to the target will install on their phone or computer with physical access. Phishing is sending the target an email with a password reminder or reset that tricks the user into entering their password into a site or form the attacker controls. Password reminder is gaining access to the users email account (again using secret questions or another technique) and then having a reminder link sent to access the cloud storage. Password reset is answering the date of birth and security question challenges (often easy to break using publicly available data – birthdays and favorite sports teams, etc. are often not secrets).
1. Users who take a username and password or authentication key and then “rip” the cloud based backup services using software and toolchains such as [Elcomsoft EPRB](http://www.elcomsoft.com/eprb.html). The software is heavily pirated and supports being able to dump an entire backup set, including messages and deleted photographs.
1. Collectors aggregate the data stolen by other users and organize it into folders. The two most popular services to use are Dropbox and Google Drive. The collectors will create preview images for each set and email them around to their contacts. Email addresses for collectors or those willing to trade or sell are available by referral, usually via somebody offering a hacking or ripping service.

**4.** The frequent source of new leads for targets seems to be newcomers who know somebody they want to hack and have stumbled onto one of the networks offering services via search terms or a forum they frequent. The new contributor will offer up a Facebook profile link, plus as much information as is required by the hacker to break the account, plus possible assistance in getting a RAT installed if required. In exchange the hacker and ripped will supply the person providing the lead with a copy of the extracted data, which they will also keep for themselves. This was one of the most unsettling aspects of these networks to me – knowing there are people out there who are turning over data on friends in their social networks in exchange for getting a dump of their private data.

**5.** In reviewing months worth of forum posts, image board posts, private emails, replies for requests for services, etc. nowhere was the FindMyPhone API brute force technique (revealed publicly [and exploited in iBrute](https://github.com/hackappcom/ibrute)) mentioned. This doesn’t mean that it wasn’t used privately by the hackers – but judging by the skill levels involved, the mentions and tutorials around other techniques and some of the bragged about success rates with social engineering, recovery, resets, rats and phishing – it appears that such techniques were not necessary or never discovered.

**6.** iCloud is the most popular target because Picture Roll backups are enabled by default and iPhone is a popular platform. Windows Phone backups are available on all devices but are disabled by default (it is frequently enabled, although I couldn’t find a statistic) while Android backup is provided by third party applications (some of which are targets).

_Edit_ Turns out that Google+ provides backup functionality for photos uploaded via the app, something I missed when checking Android. Thanks [James for clarifying in comments](https://nikcub.me/posts/notes-on-the-celebrity-data-theft/#comment-5393).

**7.** Apple accounts seem particularly vulnerable because of the recovery process, password requirements and ability to detect if an email address has an associated iCloud account. The recovery process is broken up into steps and will fail at each point. While Apple do not reveal if an email address is a valid iCloud address as part of the recover process, they do reveal [if it is valid or not if you attempt to sign up a new account using the same email](https://twitter.com/nikcub/status/506864963047022592) – so verification (or brute force attempts) are simple. The second step is verifying the date of birth and it will pass or fail based on that data alone so can be guessed, while the last step are the two security questions. It would be a good idea for Apple to kill the interface on signup that shows new users if their email account is available to use as an iCloud account or not. It would also be a good idea to make the recovery process one big step where all data is validated at once and the user is not given a specific error message. It would also be wise to attach rate limits and strict lockout on this process on a per-account basis.

Being able to POST an email address to `https://appleid.apple.com/account/validation/appleid` and getting back a response indicating if it is a valid account or not, with little to no rate limiting, is a bug.

**7. a)** _edit_ To reiterate what the main bugs are that are being exploited here, roughly in order of popularity / effectiveness:

1. Password reset (secret questions / answers)
1. Phishing email
1. Password recovery (email account hacked)
1. Social engineering / RAT install / authentication keys

**7. b)** Once they have access to the account they have access to _everything_ – they can locate the phone, retrieve SMS and MMS messages, recover deleted files and photos, remote wipe the device and more. The hackers here happen to focus on private pictures, but they had complete control of these accounts for a period.

**8.** Authentication tokens can be stolen by a trojan (or social engineered) from a computer with iTunes installed easily. Elcomsoft provide a tool called [atex](http://www.elcomsoft.com/help/en/eppb/extracting_authentication_mac.html) which does this. On OS X the token is installed in the keychain. The authentication token is as good as a password.

**9.** Two-factor authentication for iCloud is useless in preventing passwords or authentication tokens being used to extract online backups. 2fa is used to protect account details and updates.

**10.** There is an _insane_ amount of hacking going on. On any day there are dozens of forum and image board users offering their services. While many of those offering to rip alone based on being provided a username and password are scammers, they will still steal the data and sell it or trade it.

**11.** OPSEC level of the average user in these networks is low. 98% of email addresses provided in forums as part of advertising or promoting services are with the usual popular providers (gmail, outlook, yahoo) who are not Tor friendly. Most users speak of using VPNs when breaking into accounts and suggest which VPNs are best, fastest and “most anonymous.” It was also incredibly easy for some of those involved in distribution of the latest leaks to be publicly identified (more on that later) and for servers with dumps to be found, etc.

**12.** The darknet forums provide a lot of tips in terms of the hacking steps and also provide databases of passwords, users and dox but in terms of distributing content are usually a step behind the publicly available image boards. They are definitely more resilient in terms of keeping content up once it is published, and might become more popular with users if more data is leaked. Overchan and Torchan have in the past day or longer been full of new users requesting darknet links to the leaked content, and they receive them.

**13.** The different file name formats, data inconsistencies and remnants such as Dropbox files being found in the dumps can be explained by the different recovery software used (some which restores original filenames, some doesn’t) and the dumpers and distributors frequently using Dropbox to share files. It is unknown how many hackers were involved in retrieving all the data, but the suggestion is that the list of celebrities was the internal list of one of the trading networks. Timestamps, forum posts and other data suggests that the collection was built up over a long period of time.

![ransomware](/images/posts/Screen_Shot_2014-09-03_at_6.22.13_AM.webp)

**14.** On the topic of OPSEC. Tracking down one of the distributors who was posting ransomed private images to 4chan and reddit was simple. He posted a screenshot as part of pitching the sale of 60 or more images and videos for a single celebrity but didn’t black out his machine name or the machine names of the other computers on his local network. A user on reddit did a Google search and tracked down the company he worked for (although they picked the wrong employee). Tracking each of those names linked one of them back to a reddit account that had posted a screenshot of the exact same explorer interface (the guy had a bad habit of taking screenshots of his own machine). He has denied being the source of the images, but he is definitely a distributor who purchased them from within the network since the ransomed set he posted were all images that did not and have not yet leaked.

_edit:_ Turns out Maroney was underage when these pictures were taken, which means this screenshot is an admission of posesssion of child pornography. Reddit mods on the fappening sub are [desperately asking users](http://www.reddit.com/r/TheFappening/comments/2fa2a1/meta_effective_immediately_any/) to remove any images of her and other underage celebrities.

**15.** I personally don’t distinguish between somebody who stole the data directly and somebody else who “only” bought that data with the intention of selling it for a profit to the public.

**16.** It seems to have gone wrong for not only our identified friend but a lot of other members of this network over the past few days. It appears the intention was to never make these images public, but that somebody – possibly the previously identified distributor – decided that the opportunity to make some money was too good to pass up and decided to try to sell some of the images. The first post from this set that I could track down was nearly 5 days to the story becoming public, on the 26th of August. Each of those posts was a censored image with a request for an amount of money for an uncensored version. After numerous such posts and nobody paying attention to it (thinking it was a scam) the person behind the posts began publishing uncensored versions, which quickly propagated on anon-ib, 4chan and reddit. My theory is that other members of the ring, seeing the leaks and requests for money also decided to attempt to cash in thinking the value of the images would soon approach zero, which lead to a race to the bottom between those who had access to them.

**17.** In terms of staying secure the most obvious solutions are to pick a better password, set your security answers to long random strings and enable two-factor authentication. Further it is a good idea to ring-fence your email – use one email address that remains private for sensitive accounts such as your online banking, cloud storage etc. and then a separate account for communications whose address is made public. There is no privacy mode in phones and they lump together all your data and metadata in one large bucket, and the only solution if you wish to retain a more private or more anonymous profile is to run a separate phone with the account on there belonging to an alias. There is a reason why drug dealers carry multiple phones, it tends to work in terms of segregating your real identity.

**18.** There is no software that users will ever be able to install or upgrade that will make them completely secure. The responsibility is on both vendors and users. Users need to be aware of good password practices (unique passwords, long, passphrases) as well as the basics of anonymity and security (more on this in another post – attempting to tl;dr security tips in a few, small and simple to understand points)

**Update:** Apple have since [released a statement](http://www.businesswire.com/news/home/20140902006384/en/Apple-Media-Advisory):

_Edit_ The businesswire link is down – the same statement is [available in its original form on the Apple website](http://www.apple.com/pr/library/2014/09/02Apple-Media-Advisory.html):

> After more than 40 hours of investigation, we have discovered that certain celebrity accounts were compromised by a very targeted attack on user names, passwords and security questions, a practice that has become all too common on the Internet. None of the cases we have investigated has resulted from any breach in any of Apple’s systems including iCloud® or Find my iPhone. We are continuing to work with law enforcement to help identify the criminals involved.
