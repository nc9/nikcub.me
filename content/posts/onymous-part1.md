---
title: Large Number of Tor Hidden Sites Seized by the FBI in Operation Onymous were Clone or Scam Sites
date: 2014-11-17T17:10:12+0000
excerpt: The FBI announced the seizure of a large number of darkweb sites to much fanfare. It turns out most of what they got were fake clone sites
---

_This post is the first in a series dealing with the takedown of Silk Road 2.0 and [Operation Onymous](http://en.wikipedia.org/wiki/Operation_Onymous). The data in this post was put together with [@secruedmh](https://twitter.com/secruedmh) and [@imposter](https://twitter.com/1mp0ster). A big thanks to Juha Nurmia and his [Tor Hidden Service Index](https://ahmia.fi/search/), and researchers who share their work or report on stories such as [lamoustache](http://www.twitter.com/lamoustache), [gwern](http://www.gwern.net), [deepdotweb](http://www.deepdotweb.com/) along with others who don’t wish to be named for helping us fill in our index and cache. For updates [follow on twitter](https://www.twitter.com/nikcub)._

In the two weeks since Silk Road 2.0 and a large number of other Tor hosted hidden services were taken down as part of Operation Onymous, we have crawled and indexed onion sites to find out just how many sites were seized and what sites were seized. Initial reports said 410 sites were seized, then 400 and this number has continued to be revised down until Europol said only some two-dozen sites were seized. Our crawl of just over 9,000 onion sites has found 276 seized onion sites.

The full table of seized onion sites discovered is below, an overview of the data and some findings:

1. Out of a total of 276 seized onion addresses found, we identified 153 of the addresses as belonging to either clone, scam or phishing sites.
1. Of the 153 clone or scam sites, 133 were clones and 20 were scam or phishing sites.
1. In a number of cases the FBI has seized the clone or scam version of a site while leaving up the real site.
1. In May of 2014 a bot known as the “Onion Cloner” [was discovered](http://allyour4nert7pkh.onion/wiki/index.php?title=Onion_Cloner) and became known to Tor hidden service operators. This bot would find Tor hidden sites and clone them on its own address in an effort to steal passwords or intercept Bitcoin transactions. Of the 133 clone sites that the FBI seized, a large number of them were clone sites produced by the Onion Cloner that were mistaken for the real copy.
1. Of the 8 websites mentioned in the [FBI press release](http://www.fbi.gov/newyork/press-releases/2014/dozens-of-online-dark-markets-seized-pursuant-to-forfeiture-complaint-filed-in-manhattan-federal-court-in-conjunction-with-the-arrest-of-the-operator-of-silk-road-2.0), 2 are clones and 1 is a scam site.
1. Of the 32 onion addresses mentioned in the [DOJ seizure notice](https://www.scribd.com/doc/246222731/Operation-Onymous-Dark-Markets-Seizure-Forfeiture-Complaint) filed in US court, 3 are scam sites and 9 are clone websites.
1. As far as our survey has revealed and based on prior data about the Onion Cloner, **every single** Onion Cloner clone site has been seized or is no longer available.
1. For the following sites, the clone or fake version was seized while the real site remains live: Cannabis UK, CStore, Dedope, Executive Outcomes, FakeID, Fake Real Plastic, Hackintosh, Pablo Escobar Drug Store, Real Cards Team, Smokeables, Zero Squad. Some of these sites were mentioned in the FBI press release or court seizure notice as having been taken down when in fact the clones were seized.
1. There are almost 200 sites that have been seized that are not mentioned in any seizure notice or press release. These include the (real) sites for Fish Squad, Exposed, Hack the Planet, Cash Machine, DOXBIN, Pink Meth, OnionSphere, Mr Ouid’s Forum. That list includes personal websites, forums or other sites that had no outward appearance of illegal activity, and they are also not mentioned in any court or press documents. These sites were seized with what appears to be no, or little legal justification.
1. Scam or phishing versions of Silk Road 2.0, Agora, Real Cards Team, Evolution and many other sites were seized.
1. For some of the onion addresses, being mentioned in the FBI press release or the seizure notice is the first and only ever public web mention of the address.
1. The website “Executive Outcomes”, which the FBI claims in seizure notices and press releases was a retailer of firearms was a well known scam site – it never shipped any weapons but took users funds.
1. A clone of a Jihad funding website called “Fund the Islamic Struggle without leaving a trace” [was seized, while the real website remains live](https://www.nikcub.me/posts/fbi-seizes-fake-tor-hosted-jihad-funding-website-as-part-of-operation-onymous-leaves-up-real-site/) (and has accepted over 5 BTC in donations)

### Indications of Method

That the FBI seized so many clone and fake websites suggests a broad, untargeted sweep of hidden services rather than a targeted campaign. The slapshot nature of how sites were seized suggests that rather than starting with an onion address and then discovering the host server to seize, this campaign simply vacuumed up a large number of onion websites by targeting specific hosting companies. We have tracked down the hosting companies affected and the details will be published in a follow-up.

On that note, if you were the administrator of a hidden site that was seized, be it a clone or a real site, please get in touch. I’ve spoken to a number of admins and hosting companies and have put together what the seized sites had in common in order to deduce the method used to locate them. Information from admins and hosts is invaluable in working out what the weaknesses of the seized sites was, and what can be learned from the seizures. There is a high likelihood that none of the seizures will be tested or revealed in court, at least not in the short term, so getting this information is important.

### Tor Onion Data

The database of hidden sites, which I believe is the largest that has been collated, will be [posted to this GitHub repository](https://github.com/nikcub/tordata) sometime in the next couple of days. An earlier version of the crawler used is [also available on GitHub](https://github.com/nikcub/torsurvey). We are currently putting together an index of data from the seized sites, including the forums, and other Tor hidden services along with a search engine. If you’re interested in contributing or adding data to it send a pull request.

**\*Table key:** Column S = Site mentioned in [DOJ seizure notice](https://www.scribd.com/doc/246222731/Operation-Onymous-Dark-Markets-Seizure-Forfeiture-Complaint). Column P = Site mentioned in [FBI press release](http://www.fbi.gov/newyork/press-releases/2014/dozens-of-online-dark-markets-seized-pursuant-to-forfeiture-complaint-filed-in-manhattan-federal-court-in-conjunction-with-the-arrest-of-the-operator-of-silk-road-2.0)\*

| Site                                    | Host                     |       |  S  |  P  |
| :-------------------------------------- | :----------------------- | :---- | :-: | :-: |
| Tor Bazaar Forum                        | `22iwhc2luicynjqy.onion` |       |     |
| Fake ID                                 | `23swqgocas65z7xz.onion` | Clone | \*  | \*  |
| NLGrowers                               | `25ffhn7bm5fget24.onion` | Scam  |     |
| Tor web developer:                      | `2hcruaawg3e55vfa.onion` | Clone |     |
| The Dealer:                             | `2sr3d7kvco5iy6ws.onion` | Clone |     |
| Doublespend                             | `2xfmz7uf6ip6kpg3.onion` | Scam  |     |
| The Hidden Wiki (mirror):               | `33lwkzt672innsj6.onion` | Clone |     |
| KavkazCenter:                           | `33vqatzbvipi5ghe.onion` | Clone |     |
| Trava Pricelist                         | `34j2fiy32xwuxsku.onion` |       |     |
| Sea Kitten Palace:                      | `3cvsdlyltwapggbf.onion` | Clone |     |
| EU DRUGSTORE:                           | `3d635wnxku6h43eg.onion` | Clone |     |
| FAQ :                                   | `3e5rqv7542gxvwpk.onion` | Clone |     |
| Bitiply                                 | `3ioo62dyl5xawlmw.onion` | Clone |     |
| –                                       | `3nslokdcllxywuxp.onion` |       |     |
| TORFORUM:                               | `3osf4ttzukk5aouy.onion` | Clone |     |
| Tor Bazaar                              | `3p42y56a76g6okuv.onion` |       | \*  |
| Fund The Islamic Struggle Anonymously   | `bc3nbr42tdnqamvs.onion` |       |     |
| Exposed – The Secret Web                | `4dpc64mjcbu5kkyn.onion` | Clone |     |
| AYPSELA news:                           | `4jdirmqv2o65dlum.onion` | Clone |     |
| Cloud Nine                              | `4jt6iq3r3agaldg7.onion` |       |     |
| EasyCoin Bitcoin Wallet &amp; Mixer”    | `4p7orzshxhif6cfz.onion` | Clone |     |
| TorShops                                | `4ywfa43x2dutp5ta.onion` | Scam  |     |
| Jotunbane’s Reading Club:               | `52frxf3nn43n6rt5.onion` | Clone |     |
| BrainMagic                              | `5j7o54ivsh3qqgu3.onion` | Clone |     |
| 1 Hour Laundry:                         | `5mkcloe3kuefrqvr.onion` | Clone |     |
| Fast Cash!                              | `5oulvdsnka55buw6.onion` |       | \*  | \*  |
| TorBox:                                 | `5wxxvwnsvwsv2ens.onion` | Clone |     |
| Farmer1                                 | `5x5hcw4ym6nno42p.onion` |       | \*  |
| GreenPaper Counterfeiters (Super Notes) | `67yjqewxrd2ewbtp.onion` | Scam  | \*  |
| Onion Mail:                             | `6e44iwci5e6iodyw.onion` | Clone |     |
| Green Machine                           | `6hstmidevw5dhkct.onion` |       |     |
| The Green Machine                       | `6ijclyvilv53ll76.onion` |       | \*  |
| SteamLoader:                            | `6nkwg6ngv5txpfqc.onion` | Clone |     |
| Doxbin / DeDope                         | `6odhiu7bke342ip5.onion` |       | \*  |
| Green Dragon Supplier                   | `6wlmeo5zdm5jzex5.onion` |       |     |
| Evolution (Phishing)                    | `7bt3s7ikypzurhue.onion` | Scam  |     |
| Wall Street Tor:                        | `7ttedph3rjhoh24y.onion` | Clone |     |
| –                                       | `7xghcctm7r5ef6ce.onion` |       |     |
| Cash Flow                               | `7y6e3uutyvoi2myq.onion` |       |     |
| Babylon                                 | `a7jtfnjllglyjq4q.onion` |       |     |
| Onion Identity Services                 | `abbujjh5vqtq77wg.onion` | Scam  |     |
| USFakeIDs                               | `abo7iovzgznlqbno.onion` | Clone |     |
| Lossless Audio Files:                   | `afismo35weljjdcv.onion` | Clone |     |
| KognitionsKyrkan:                       | `afkpdjdkvkir4mp4.onion` | Clone |     |
| Agora (Phishing)                        | `agorazbdc4zq5oww.onion` | Scam  |     |
| Alpaca                                  | `alpaca727o3c75xx.onion` |       |     |
| Alpaca Marketplace                      | `alpaca7bcqv2rnu3.onion` |       | \*  |
| SOL’s Unified USD Counterfeit’s         | `aodaost3cbxnzgno.onion` | Clone | \*  |
| Cloud Nine                              | `aoyukbwlwxzcllet.onion` |       |     |
| NLGrowers:                              | `aukpec3jyuuoe5cm.onion` | Clone |     |
| img.bi:                                 | `b35trto3blj4bpq4.onion` | Clone |     |
| Onionweb filehosting:                   | `b3xbwcuuflw73r5u.onion` | Clone |     |
| TORCH                                   | `b7i32g7huhreg2dd.onion` | Clone |     |
| Tor Bazaar                              | `bazaar755zbjb121.onion` |       | \*  |
| Tor Bazaar                              | `bazaarlv2a7i3uyn.onion` |       | \*  |
| Onion Channel                           | `bcyh7mzfrekxobud.onion` | Clone |     |
| Cloud Nine                              | `bg62ti72ckuo6rm2.onion` |       |     |
| Blue Sky                                | `blueskyplzv4fsti.onion` |       | \*  | \*  |
| Mysterious                              | `bt7wb565zgx3xuug.onion` | Clone |     |
| Bungee54                                | `bungee54uqchxfny.onion` |       | \*  |
| Lion Pharma                             | `bvhbasj4jxhwc7d7.onion` | Clone |     |
| Cloud Nine (Main)                       | `bviaqyj6obc54vhn.onion` |       |     |
| Cloud Nine                              | `c6x3fexjje4uaczd.onion` |       |     |
| –                                       | `c76dtzddabepos74.onion` |       |     |
| Buy Twitter Followers:                  | `c7kbn6qnsw6glp5c.onion` | Clone |     |
| Cannabis Road                           | `cannabiskofvl7pa.onion` |       | \*  |
| Hack The Planet                         | `chippyits5cqbd7p.onion` |       |     |
| Cstore – Carded Store                   | `cstoreav7i44h2lr.onion` |       |     |
| MAGIC MUSHROOMS STORE:                  | `cvy25jynw7g6tamj.onion` | Clone |     |
| Cloud Nine                              | `cxhlovvocanzs7ka.onion` |       |     |
| TorSafe:                                | `cxyamaiowtvnj22a.onion` | Clone |     |
| Cloud Nine                              | `cyeji6dcpvad5zsq.onion` |       |     |
| Cloud Nine                              | `czl2oqmd3ovghwk5.onion` |       |     |
| The Pot Shop                            | `d5jkxy5i6r3sddfw.onion` |       |     |
| Data Bin                                | `databinhwin4xuxx.onion` |       |     |
| DeDope                                  | `dedope6uu7errzu3.onion` | Scam  |     |
| Steal This Wiki mirror:                 | `dejxz2tiz6f5nbrp.onion` | Clone |     |
| Black Market                            | `dgoega4kbhnp53o7.onion` | Clone | \*  |
| Black Market:                           | `dgoegaf7vnu3uowm.onion` | Clone |     |
| Clean My Coins Fake                     | `djyy6p2ohwkkmn2l.onion` | Clone |     |
| Andromeda                               | `dlifghyxshlgjlzw.onion` | Clone |     |
| Help Guy                                | `dm4gtebssktdskxn.onion` | Clone |     |
| Blackbank Market (Scam)                 | `do37y4wk2detgi6x.onion` | Scam  |     |
| Cannabis UK                             | `dokpyl6egokvejos.onion` | Clone | \*  |
| Doxbin                                  | `doxbinbhx7nvfq62.onion` |       |     |
| Doxbin                                  | `doxbindtelxceher.onion` |       |     |
| Doxbin                                  | `doxbinicsjqqmohl.onion` |       |     |
| Doxbin                                  | `doxbinphonls5hsk.onion` |       |     |
| Doxbin                                  | `doxbinumfxfyytnh.onion` |       |     |
| Doxbin                                  | `doxbinyvbolyfhss.onion` |       |     |
| Doxbin                                  | `doxbinzqkeoso6sl.onion` |       |     |
| Pablo Escobar Drugstore                 | `drugs6ayt3njhzha.onion` | Scam  | \*  |
| Doxbin                                  | `dxwmc6b3mtklq44j.onion` |       |     |
| The Armory clone                        | `dzc6ptsiaajb3mjj.onion` |       |     |
| Amberoad                                | `e2lp3d74xdfqmguk.onion` | Clone |     |
| Silkroad 2.0:                           | `e5wvymnx6bx5euvy.onion` | Clone |     |
| Outlaw Market                           | `eaq2e77pmdvrepbq.onion` |       |     |
| EasyCoin                                | `easycoinsayj7p5l.onion` |       |     |
| Cloud Nine                              | `eb3bbtsqywrdo5ae.onion` |       |     |
| Real Cards Team                         | `en74n7uqro3flkmz.onion` | Clone | \*  |
| Cloud Nine                              | `epj7nsddjr3jaorc.onion` |       |     |
| Cloud Nine                              | `epvjwvjhqs74iq7l.onion` |       |     |
| EuroGuns                                | `eurogunjz5w4qb46.onion` | Scam  |     |
| Exposed                                 | `exposed36mq3ns23.onion` |       |     |
| Sell your pictures for Bitcoins         | `f2x5eapxymahuf2t.onion` | Clone |     |
| EuCanna                                 | `f4ggfopjge6utz3n.onion` | Clone |     |
| –                                       | `fbnu5jkwi2daxcze.onion` |       |     |
| Cstore – Carded Store                   | `fd4qqglswwsv6fph.onion` | Clone | \*  |
| Deutschland im Deep Web                 | `fjgf5eo4zyntgbus.onion` | Clone |     |
| Flugsvamp                               | `flugsvampfgdzp76.onion` |       |     |
| Bitcoin For Proxy                       | `fogcoreohrvfeur5.onion` | Scam  |     |
| Cannabis Road                           | `forumzxmoorof4ja.onion` |       | \*  |
| Welcome, We’ve been expecting you!:”    | `foubiqu6uin2dv2n.onion` | Clone |     |
| USA/EU Fake Documents store:            | `ftkfjfsbsc3yebzw.onion` | Clone |     |
| Laundry King:                           | `fvb7crr4hu7u57m6.onion` | Clone |     |
| Apples 4 Bitcoin                        | `fvpibvo6tphexfvl.onion` | Scam  |     |
| Double Your Bitcoins                    | `fwpplqylgbpjymrr.onion` | Clone |     |
| MALINA                                  | `fzmmntb5ufod2zyt.onion` | Clone |     |
| TorFind:                                | `g3tqsiw5rc6d6vmc.onion` | Clone |     |
| konkret – das linke magazine            | `gcymml5rdr6lhpto.onion` |       |     |
| –                                       | `ghwntyvlyt5t65l4.onion` |       |     |
| Словесный Богатырь                      | `gr4dszr5zd2k44qa.onion` | Clone |     |
| Deep Web Radio:                         | `gzkqe6rodeexilic.onion` | Clone |     |
| DuckDuckGo:                             | `h2dbmwstr6klbsi6.onion` | Clone |     |
| The Pirate Market:                      | `h5nfci2xgob2nheu.onion` | Clone |     |
| Cloud Nine                              | `h5ry3wfk7md3vkfc.onion` |       |     |
| Cash Machine                            | `hcutffvavocsh6nd.onion` |       |     |
| The PaypalCenter                        | `hd74evbdzn6cl264.onion` | Scam  |     |
|                                         | `heqiepy33ssju7bn.onion` |       |     |
| Black&amp;Yellow                        | `hwvx64v3zu43ih75.onion` |       |     |
| Hydra Forum                             | `hydrafmchvpq5yc6.onion` |       | \*  |
| Hydra                                   | `hydrampvvnunildl.onion` |       | \*  | \*  |
| Hydra Russian                           | `hydraruehsdjjfud.onion` |       |     |
| TorSearch:                              | `i7fahngv323nndta.onion` | Clone |     |
| Executive Outcomes                      | `iczyaan7hzkyjown.onion` | Clone | \*  | \*  |
| Fake Real Plastic                       | `igvmwp3544wpnd6u.onion` |       | \*  | \*  |
| TorGameDepot:                           | `ilf5incisxerov56.onion` | Clone |     |
| Cloud Nine                              | `itjsuhezvyyi7pjg.onion` |       |     |
| –                                       | `ixfdahfew32luevo.onion` |       |     |
| Super Notes Counter                     | `j62alxawj7624ejg.onion` | Clone |     |
| Hydra                                   | `j6372sksh6uolrzz.onion` |       |     |
| Site do Renan Jackson:                  | `jcfcrq76kdc4ghmo.onion` | Clone |     |
| Cocaine Market                          | `jd3gdrtmhm7vwudx.onion` |       |     |
| CYRUSERV:                               | `jf5p4debofmd2kdq.onion` | Clone |     |
| Mr Quid’s Forum                         | `jfekrr6wghtmalpd.onion` |       |     |
| Apple’s Tor                             | `jff4wifbjuqmhubb.onion` | Clone | \*  |
| OnionNews:                              | `jgfoj3jyfinnrbs5.onion` | Clone |     |
| Cloud Nine                              | `jgpvu5d5fufwpqa7.onion` |       |     |
| Cloud Nine                              | `ji45q56enmtidgl5.onion` |       |     |
| Cheap Euros                             | `jmntdqtytkuhqlzu.onion` | Clone |     |
| The House of Cards:                     | `jmobhake4txapqd7.onion` | Clone |     |
| paraZite                                | `juctmzs5jwu3cd6l.onion` | Clone |     |
| Cloud Nine                              | `jz3rmfugjt5eiyr5.onion` |       |     |
| WeBuyBitcoins                           | `jzn5w5pmhmbqxmzi.onion` |       |     |
| Onion Identity Services                 | `k5dvoeyiwakymez5.onion` | Clone |     |
| DeDope                                  | `kbvbh4kdddiha2ht.onion` |       |     |
| Apple Palace                            | `kcan7d4ahhryu6gg.onion` | Clone |     |
| The Hidden Wiki                         | `kpvz7ki2v5agwt35.onion` |       |     |
| The Tor Library:                        | `lgic2yjpimouvjnw.onion` | Clone |     |
| Cloud Nine                              | `lhckzzv3qlvcwfg2.onion` |       |     |
| Doxbin                                  | `lhvxqyd7ux2oinn7.onion` |       |     |
| Kamagra for Bitcoin:                    | `lnien5hngzlojppv.onion` | Clone |     |
| The PayPal Center                       | `lygnimwoedhioopl.onion` |       |     |
| Silkkitie                               | `m2lbhzmzmfv5a763.onion` |       |     |
| Vault43                                 | `m7653h3gcw7d2ytf.onion` |       |     |
| MALINA                                  | `malina2ihfyawiau.onion` |       |     |
| CebollaChan:                            | `mdlhkgnddfijuh4z.onion` | Clone |     |
| Runion                                  | `mescqp3y3sfo27rm.onion` | Clone |     |
| Hidden Betcoin                          | `mqaa6l5vb7rbpksf.onion` |       |     |
| The PayPal Center                       | `mv5cb4hz3ecscshx.onion` |       | \*  |
| Cloud Nine                              | `mx7rzz5my2fq46wz.onion` |       |     |
| Prepaid Bliss:                          | `n5qsqwl2y3qrr2jq.onion` | Clone |     |
| Cloud Nine                              | `n7hwwwncx3bcx5vc.onion` |       |     |
| Cloud Nine                              | `ned32wtuel43cxbf.onion` |       |     |
| Torchan:                                | `noqfeqisdgchn7zb.onion` | Clone |     |
| Doxbin                                  | `npieqpvpjhrmdchg.onion` |       |     |
| MORAL.NU                                | `nskxjg4c3nvwzxuw.onion` | Clone |     |
| Paypal-Coins                            | `o3ecpxemcg4itdoy.onion` | Clone |     |
| Onionshop                               | `onionsvpscug6wpk.onion` |       |     |
| The Secret Story Archive:               | `oqgylsk6seo42gpk.onion` | Clone |     |
| Tor Bazaar Beta                         | `orjidjtyniyzn5il.onion` |       |     |
| Drug Market                             | `oxr3dae6epxdc4pg.onion` | Clone |     |
| The Secret Story Archive #1st:          | `oxrxwesdxlnwsj3x.onion` | Clone |     |
| USJUD Counterfeits                      | `p4ecvpaclc44j3jz.onion` | Clone |     |
| Cloud Nine                              | `p6qx55i5r64mxq7n.onion` |       |     |
| Pandora                                 | `pandora3uym4z42b.onion` |       | \*  | \*  |
| Clone Site                              | `pbq2zmsrh4cdxdxl.onion` | Scam  |     |
| UK Passports:                           | `pclb34gpalrdxj4u.onion` | Clone |     |
| nachash                                 | `penisycpu3fixdcr.onion` |       |     |
| Green Dragon Supplier                   | `pg5epl6suareiqq6.onion` |       |     |
| Old Man Fixer’s Fixing Services         | `ph22uxxxttai7v2n.onion` | Clone |     |
| BitPharma                               | `pharmagbsxol4n4k.onion` |       |     |
| BitPharma                               | `pharmajiyhpjflqi.onion` | Clone |     |
| Pink Meth                               | `pinkmethuylnenlz.onion` |       |     |
| Mobile Store                            | `pptzzk2wye6rfeki.onion` | Clone |     |
| MailTor:                                | `pyvdmllsh6mczfgb.onion` | Clone |     |
| PayPal4U                                | `qbikfpcr4mhqoumm.onion` |       |     |
| R2D2                                    | `qrfnwgdjdsgtx5u4.onion` | Clone |     |
| Tor Carding Forums                      | `qtr46f7bgf4kzt7q.onion` |       |     |
| Cloud Nine                              | `rgam2tqpqhelm4ow.onion` |       |     |
| Cloud Nine                              | `rhmhjalcohuys4a5.onion` |       |     |
| UK Guns and Ammo                        | `rhqetwhda65zcakj.onion` | Clone |     |
| RUForum:                                | `rk5pbdbyrqksxui4.onion` | Clone |     |
| Hidden Wiki:                            | `rmhpp6w3ncrvxiub.onion` | Clone |     |
| Tor:                                    | `rmnd3b5dvuqtshlh.onion` | Clone |     |
| Cloud Nine                              | `rndm56yv54aqe7pn.onion` |       |     |
| Example rendezvous points page:         | `rqjfolmb2h7iqdvq.onion` | Clone |     |
| Thunder’s Place:                        | `s5yvlnz7qljsdmtc.onion` | Clone |     |
| ccPal                                   | `safj5y2f45whsvvs.onion` | Clone |     |
| Cloud Nine                              | `sdjv72hp5x6pt5en.onion` |       |     |
| Doxbin                                  | `senmtjpxn2m72nlu.onion` | Clone |     |
| Silkkitie                               | `silkkitiehdg5mug.onion` |       |     |
| Silk Road 2.0                           | `silkroad3og4b6bq.onion` | Scam  |     |
| Silk Road Forums                        | `silkroad5v7dywlc.onion` |       |     |
| Silk Road                               | `silkroad6midjsbr.onion` |       | \*  |
| Silk Road                               | `silkroad6ownowfk.onion` |       |     |
| Smokables                               | `smoker3gvmgfbi4e.onion` | Clone | \*  |
| Brave Bunny                             | `sqxamnigeby5u37b.onion` | Clone |     |
| Wikileaks New link:                     | `srozpqsnh2lgyewu.onion` | Clone |     |
| Cloud Nine                              | `srz5wvnyd7skt5uh.onion` |       |     |
| samsungstore                            | `storegsq3o5mfxiz.onion` |       |     |
| Флибуста \| Книжное братство”           | `su74joxcacuafyq6.onion` | Clone |     |
| [Forum PHISHING LINK]                   | `t6la6i24jkow5roh.onion` | Scam  |     |
| Cloud Nine                              | `taifcjgrifyjiwey.onion` |       |     |
| Apples 4 Bitcoin                        | `tfwdi3izigxllure.onion` | Scam  |     |
| USA Citizenship                         | `tgielwnuv3xzfg7r.onion` |       |     |
| Topix                                   | `topixslhezyytrvm.onion` |       |     |
| â… TOR-SERV â…:                         | `torservsbt7rsbfg.onion` | Clone |     |
| Cash Machine                            | `tpe3rm2w4fkbtciu.onion` | Clone |     |
| Galaxy Social Network                   | `tvbkrvflzx2pmvpw.onion` | Clone |     |
| The Hidden Market                       | `uaq62zdqnjr4xo4q.onion` |       |     |
| Rent-A-Hacker                           | `ubquja4ech6symkv.onion` | Clone |     |
| Assassination Market:                   | `ugq2p64trcyg3xgt.onion` | Clone |     |
| Code:Green                              | `uhfftlqlyjnelhcf.onion` | Clone |     |
| Real Cards Team                         | `ujompjlrdgbhkmuj.onion` |       |     |
| Dark Hosting:                           | `ul4kmrygtkhbb5vz.onion` | Clone |     |
| samsungstore                            | `unsbwt2utosasdxq.onion` | Clone |     |
| keys open doors:                        | `uqbmgvisfz2wpj4v.onion` | Clone |     |
| Creative Hack:                          | `urjlsqe373ismjwg.onion` | Clone |     |
| Fake Real Plastic                       | `vc5apwufjoil3svw.onion` | Clone |     |
| Torbook:                                | `vg4gxg3mjymuh54x.onion` | Clone |     |
| Green Star Station:                     | `vgfzmngu7dh5ye76.onion` | Clone |     |
| Hack The Planet:                        | `vpkyqijluxa33ywp.onion` | Clone |     |
| Rich Richard:                           | `vz3ofn5f2lous44c.onion` | Clone |     |
| Doxbin                                  | `wn323ufq7s23u35f.onion` |       |     |
| –                                       | `woacuqcx45nfnfxy.onion` |       |     |
| HQER                                    | `wtpum5yzyihiewlq.onion` |       |     |
| Golden Nugget                           | `wyj4d4u237p3coca.onion` | Scam  |     |
| lol 20th Century Western Music          | `x4am6cpmndsqzbu2.onion` | Clone |     |
|                                         | `x4bfgkcuwiousozy.onion` |       |     |
| Cloud Nine                              | `x7ikq6a3qx5qjikf.onion` |       |     |
| CC-Planet Fullz                         | `xadxysdnd3ug2dea.onion` |       |     |
| Hydra Forums                            | `xdbn2gsuk74nwd7f.onion` |       |     |
| Clean My Coins                          | `xgrsaj3wykpofseb.onion` |       |     |
| RepAAA’s Hidden Empire                  | `xskus6q7olpdlrkb.onion` |       | \*  |
| Cloud Nine                              | `xvqrvtnn4pbcnxwt.onion` |       | \*  | \*  |
| Beneath VT:                             | `y4hzxepemtqcf4qh.onion` | Clone |     |
| paraZite                                | `y66x4b3jrt3mnglw.onion` | Clone |     |
| Onion Wallet                            | `y6dyzauztb5u2ufa.onion` | Clone |     |
| Flugsvamp                               | `yakwbcn5ou2wkzfx.onion` |       |     |
| Cipolla                                 | `ybphbuwerurne43o.onion` |       |     |
|                                         | `ycjvz5cu3mjc4wyd.onion` |       |     |
| Suojeluskunta:                          | `ycngkogtvlaphgx2.onion` | Clone |     |
| Cloud Nine                              | `ye5n3ecw64utvmmh.onion` |       |     |
| Onix Electronics:                       | `yhu73qfnjti3cmvf.onion` | Clone |     |
| Zyprexa Kills:                          | `yifsrwkdvjiojr7w.onion` | Clone |     |
| Peoples Drug Store:                     | `yrenuxvrrhmuvces.onion` | Clone |     |
| USD Counterfeits                        | `yrpavngfbhbc3tcc.onion` | Clone |     |
| BuggedPlanet.Info:                      | `yy5pepg54c5jry36.onion` | Clone |     |
| Zero Squad                              | `z5fvd3hwmtzkgaqy.onion` | Scam  | \*  |
| The Intel Exchange:                     | `z7d7gx53ne7fouyf.onion` | Clone |     |
| Cloud Nine                              | `z7rpuixjsncgomw7.onion` |       |     |
| OnionSphere:                            | `zbojy7pmy5vrrcqe.onion` | Clone |     |
| nekrotown:                              | `zect4qky5qdam2xd.onion` | Clone |     |
| Bitcoin-escrow:                         | `zkwwpiiksjafjo35.onion` | Clone |     |
| Mail2Tor:                               | `zv7lufndr4khlicg.onion` | Clone |     |
