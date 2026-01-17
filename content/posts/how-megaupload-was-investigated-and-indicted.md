---
title: How Megaupload Was Investigated and Indicted
date: 2012-01-20T16:47:06+00:00
---

<img src="/images/posts/image66.png"/> The popular file upload site Megaupload was [taken down](http://www.techmeme.com/120119/p97#a120119p97) today as part of a US DOJ investigation into the site for breaches of US copyright law.

From reading [the indictment](www.scribd.com/doc/78800989/Mega-Indictment) and digging around online you can start to reverse-engineer how the investigation was carried out.

The evidence in the grand jury indictment is of four forms:

- Internal emails, dating back to 2005 – including correspondance between staff members and support emails.
- Publicly accessible details such as URLs to pirated content, dates of domain registrations.
- Information from the Megaupload PayPal account and correspondance between PayPal and Megaupload
- Information from the Megaupload Moneybookers account.

The Megaupload corporate email was self-hosted on a dedicated server that was one of the 525 servers the company had located with Carpathia Hosting in Virginia. That mail server is no longer responding, but the MX record can still be found and pointing to an IP address belonging to Carpathia.

The bulk of the evidence against Megaupload is from the internal emails, likely taken from this server. I'd guess (and we won't find out for certain until the trial – that is, if this case ever gets to a courtroom) that the FBI and DOJ served Carpathia with a search warrant to gain access to the information on that email server. Under US law you are actually less protected if you host your own private email server rather than using a public service (see [this guide](https://ssd.eff.org/book/export/html/42) on what the government can and can't do). Megaupload would not have been made aware of any such search warrant.

It amazes me that this company hosted its emails in plain text on a US-based server. The irony is that there are a number of internal Megaupload email threads discussing what they should do to better shield themselves from the US government. These conversations all take place on a server hosted in the USA. The bulk of the DOJ case will be built on the email archive – and hosting their own email server in the USA may become the major cause that resulted in their downfall.

The PayPal records, including all the payment information and emails between Megaupload and PayPal, would have been attainable with a simple subpoena. The same applies for Moneybookers. Subpoenas are remarkably easy to get – and most of the larger web companies do not fight the requests. Very little probable cause is required for the government to obtain these records (to obtain the records without the subject being notified requires an additional court order).

All of the other evidence is based on public records such as WHOIS records, blog posts, download links, etc.

To establish a timeline, the New Zealand media reported that the FBI first got in touch with law enforcement officials in that country regarding Megaupload 'around a year ago'. This shows that the investigation had little to do with the recent high-profile release of a [supporters video](http://torrentfreak.com/riaa-label-artists-a-list-stars-endorse-megaupload-in-new-song-111209/) and music clip along with the associated lawsuits.

It is thus likely that this investigation began in 2010, at the latest. The emails in the indictment date until November 2011, so the search warrant must have been carried out late last year. The indictment was filed on the 5th of January this year and only unsealed yesterday. The grand jury must have taken place late last year (in 2010).

The internal emails are often incriminating. I don't buy the argument that a DMCA takedown request requires you to remove every copy of the same file, since the each request requires a legal notice that the particular user who uploaded the file does not have explicit permission to host that file. What is a worry for MegaUpload is the internal emails between staff discussing piracy, where to find pirated material, rewarding uploaders with cash payments for uploading pirated material and helping out users to find pirated material in support emails (one support email asks 'I only bought a Megaupload account to watch (the name of some show)' and the staff responded with a link to a download).

Also incriminating is the money laundering evidence. In the year 2011 alone, Megaupload spent $7.8M on renting yachts in the Mediterranean for 'marketing purposes'. There were also numerous million-dollar or greater bank transfers between a large number of what look like shell companies.

For the sake of the Internet, I hope Kimble and Megaupload refuse any plea deal and take this all the way to court. They may be guilty on racketeering and money laundering, but we need those finer aspects of DMCA and safe harbor to be tested in a US court. I would also like to find out what probably cause was used to issue a search warrant for the email server and its contents – since that is where almost all of the evidence in this case originated from and there is very little evidence in the injunction outside of the contents of those emails.
