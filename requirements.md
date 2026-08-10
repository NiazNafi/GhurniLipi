# ঘূর্ণিলিপি / ghurnilipi — Website Requirements

**Status:** Draft v0.5 — living document
**Owner:** Niaz
**Last updated:** 10 Aug 2026

**Decisions locked:**
- Two-tier fulfilment — cheap digital file, premium framed physical piece
- Market: Bangladesh only for v1
- v1 product lines: couple's name ambigram, single name ambigram, ready-made word prints
- No copyrighted song lyrics anywhere on the site or in the shop — no license held

---

## 1. Project summary

A website to showcase and sell rotational ambigrams, primarily in Bangla script, secondarily in Latin/English.

- **Brand:** ghurnilipi (ঘূর্ণিলিপি) — "whirl-script"
- **Domain:** ghurnilipi.com *(to be registered; .art optional secondary)*
- **Instagram:** @ghurnilipi *(currently Symmetry Talks, ~100 followers — to be renamed)*
- **Production tooling:** Adobe Illustrator; glyph-pairing library + UXP plugin in development

---

## 2. The signature item — Couple's Name Ambigram

A single piece of lettering that reads as **one name upright** and a **second name at 180°**. Sold as a paired gift object for couples.

**Confirmed formats (from reference photos/video):**

| Format | Description | Notes |
|---|---|---|
| Framed pair (tabletop) | Two small ornate frames side by side, one rotated 180°, so both names read simultaneously | The hero product. Ornate cast-metal frame, cream mount, black ink with fine flourishes |
| Wallet insert card | ID-window-sized card; rotating the wallet flips the name | Cheap, intimate, extremely shareable — strong low-price entry point |

**Why it works:** it needs no explanation. Two frames, two names, one drawing. The "trick" is visible in a single still photo, which is rare for ambigram work and is why it can be sold on a webpage at all.

**Fulfilment — two tiers:**

- **Digital tier.** Print-ready file, delivered after payment. No shipping, no breakage, no stock. High margin, unlimited capacity.
- **Framed tier.** Printed, mounted, framed, couriered. This is the gift object and the premium price.

**The cannibalisation risk is real and needs designing around.** If the file gives the buyer the same artwork for a fraction of the price, most will take the file — and the framed tier dies. The framed tier has to sell something the file cannot: the pair of frames, the mount, gift packaging, the fact that it arrives ready to hand over. Price the file low enough that it reads as a *different product*, not a discount on the same one. A deliberately modest file size/format for the cheap tier (screen-and-small-print only, larger sizes framed-only) is one lever.

**Open:** whether the frame is sourced in bulk or the ornate frame from the reference photos is one-off; edition/pricing structure → see §7.

---

## 3. Product lines (proposed)

**In v1:**

1. **Signature — Couple's Name Ambigram** (custom, made to order) — framed pair + wallet card
2. **Single name ambigram** — custom, one name reading both ways
3. **Ready-made word prints** — no customisation, instant delivery

**Deferred:**

4. **Tattoo commissions** — vector file delivery *(later)*
5. **Logo / wedding monogram commissions** — highest ticket, bespoke *(later)*

Note on the mix: items 1 and 2 are custom, so revenue is capped by your hands. Item 3 is the only line that earns while you sleep, and it's also what search traffic will land on. It deserves more attention at launch than its price suggests — but it needs a stock of finished pieces to launch with, which is the current gating unknown.

---

## 4. Functional requirements

### 4.1 Landing page scroll sequence

Fixed order, top to bottom:

| # | Section | Purpose |
|---|---|---|
| 1 | **Signature couple's ambigram** — the framed pair | The hook. Must land the "one drawing, two names" idea before any scrolling happens |
| 2 | **Motion section** | Proof of craft and dwell time. Shows the letterforms in motion, which a still never can. *Asset TBD — the existing lyrics video is unlicensed and cannot be used here; see below* |
| 3 | **Single name artworks** | Turns admiration into "what would *my* name look like" — the strongest buying trigger on the page |

Reference videos supplied: `youtube.com/watch?v=m4dbP5mIXPc` (landscape) and `youtube.com/shorts/BmZO8A6Z7ac` (vertical). *Not viewable from here — treat any assumption about their content as unconfirmed.* **Both use unlicensed music and are ruled out as site assets; retained as social-media portfolio only.**

**Technical requirements for the video section:**
- **Two aspect ratios already exist — use both.** The Short (9:16) for mobile, the landscape cut for desktop. Don't letterbox one into the other.
- **Do not embed a raw YouTube iframe.** A standard embed pulls well over a megabyte before the visitor decides to watch, which is unacceptable on a Bangladeshi mobile connection. Use a facade: static poster frame, play button, load the real player only on tap.
- **Sound is the problem.** Browsers block autoplay with audio, and a lyrics video without audio is meaningless. So: muted silent loop as the teaser, tap for the full thing with sound. Burned-in Bangla text carries it either way.
- **Keep a conversion path visible.** The video is the most engaging and least commercial thing on the page. Someone who watches it and scrolls away has cost you. A persistent "get your name done" call-to-action alongside it, not below it.
- Behaviour must be checked inside the Facebook in-app browser specifically, where video handling is unreliable.

**Sequencing note:** section 2 sits between your hook and your strongest buying trigger. If the video runs long, consider swapping 2 and 3 so single names come first — engagement is worth less than intent. Worth testing rather than deciding on instinct.

**Lyric-based work is out of scope** — no license held for the music or the words, so it can't appear on the site or in the shop. The existing videos stay on YouTube and Instagram as portfolio. Parked, not cancelled; revisit if a licensing route opens up. (Not legal advice.)

**Slot 2 asset — three routes:**

1. **Public-domain Bengali text.** Rabindranath Tagore's work is out of copyright, and Lalon's songs are traditional. Both are more culturally resonant than a current pop lyric, and — critically — you can *sell* these as prints. You'd still need your own or a Creative Commons recording, since a specific performance is separately copyrighted even when the song isn't. Note that Nazrul is **not** yet public domain in Bangladesh (died 1976; life + 60 years).
2. **A making-of.** An Illustrator screen-capture of a glyph pair being constructed and resolving into a readable name. No music needed, so no licensing question at all, and it builds craft credibility better than a finished piece does.
3. **A silent rotation showcase.** Pieces turning 180° in sequence — the wallet reveal, the framed pair, a single name. Your existing footage may already cover this.

Routes 2 and 3 also dissolve the autoplay-audio problem from earlier: if the section was never going to have sound, muted looping is the intended experience rather than a degraded one.

### 4.2 The rotation reveal — core interaction
Every ambigram displayed must be experienceable as rotating, not just described. Options: tap/hover to rotate, scroll-driven rotation, or a clean looping video. Must degrade gracefully — most traffic will be Instagram-referred, on a phone, one-handed.

### 4.3 Commission intake
The highest-value page on the site is not the gallery, it's the form. Must capture:
- the two names, in Bangla script and in Latin transliteration
- script preference (Bangla / English / both)
- format and size
- occasion and deadline
- reference photos or spelling notes
- deposit at submission

### 4.4 Catalog / gallery
Filterable by script and by type (couple / single / word / tattoo). Each piece gets a detail view large enough to admire the letterforms.

### 4.5 Commerce — Bangladesh
- **Currency:** BDT only. Prices in Bangla numerals as well as Latin where it reads naturally.
- **Payments:** mobile financial services are the default expectation — bKash, Nagad, Rocket. An aggregator (SSLCommerz, aamarPay, ShurjoPay) covers these plus cards in one integration. Stripe does not operate in Bangladesh; don't design around it.
- **Courier:** Steadfast, RedX, Pathao or Sundarban for physical items. Inside-Dhaka vs outside-Dhaka rates differ and must be shown before checkout.
- **Cash on delivery is the hard problem.** COD is what BD buyers expect, but it is dangerous for made-to-order work: a refused delivery of a piece with two strangers' names on it is unsellable inventory. **Custom pieces should require prepayment, or at minimum a non-refundable deposit that covers materials.** COD can be offered freely on ready-made word prints, where a refusal just returns to stock.
- Order status visible to the buyer for made-to-order items; most BD buyers will otherwise ask on Messenger, repeatedly.
- Digital tier: secure delivery link, watermarked preview before payment, clean file after.

### 4.6 Bilingual interface
Bangla-first, English secondary. Bangla is the brand language and, for a Bangladesh-only launch, the primary UI language — English is there for the diaspora you'll get anyway and for a later international phase.

### 4.7 Where the traffic actually comes from
For a Bangladesh audience, **Facebook outweighs Instagram substantially**, and a large share of small-brand commerce happens inside Messenger rather than on a website. Two implications: a Facebook Page and catalogue matter at least as much as the Instagram rename, and the site must survive being opened in the in-app Facebook browser, which is a notoriously poor rendering environment. Add a visible Messenger/WhatsApp contact path — insisting people use a form when they expect to chat will cost you orders.

### 4.8 Content
Process/FAQ page that preempts client questions (turnaround, revisions, what's deliverable, what names don't work well). "Not every name pair is possible" needs saying up front, kindly.

---

## 5. Non-functional requirements

- **Mobile-first.** Assume phone, vertical, Instagram referral.
- **Bangla typography.** Proper Bengali webfont with correct conjunct rendering; no fallback-font breakage. This is a lettering brand — broken script on the site is fatal.
- **Image fidelity.** Fine hairline flourishes must survive compression. Vector (SVG) wherever possible.
- **Performance** on Bangladeshi mobile networks.
- **Discoverability** for "bangla ambigram", "নাম আম্বিগ্রাম", couple gift, tattoo queries.

---

## 6. Out of scope for v1

- International shipping, multi-currency, PayPal/Stripe
- Tattoo and logo commission lines
- User accounts / login (guest checkout only)
- Any automated ambigram generator on the site — that research is a separate track and shouldn't gate the shop
- Print-on-demand partners, wholesale, reseller pricing
- **Lyric ambigrams** — song lyrics and lyric videos, in any form, on the site or in the catalogue. Unlicensed. Parked for now

---

## 7. Open questions

1. **The frame:** is the ornate frame from the reference photos a repeatable sourced item, or a one-off? The whole framed tier depends on this.
2. **Capacity:** how many custom pieces per week can you deliver alongside your day job?
3. **Pricing:** what do the file tier, wallet card, and framed pair each sell for in BDT? Any past sales to anchor on?
4. **Turnaround and revisions:** how long, and how many rounds included?
5. **Build route:** custom-coded, or a hosted store to start?
6. **Names that don't work:** not every name pair is achievable. How is a request declined, and is the deposit returned?
7. **Existing inventory:** how many finished pieces do you have to launch a gallery and the ready-made print line with?
8. **Wallet card:** printed and shipped by you, or included as a file with every digital order?
9. **Slot 2 replacement:** public-domain text piece, making-of capture, or silent rotation showcase? What footage already exists?
10. **Section 2 vs 3 order:** does the video come before or after single names? Test rather than guess.

---

## 8. Reference material
Find in for hero folder
- `mayeesha_aman.jfif` — framed pair, tabletop, daylight
- `c39882fe…jfif` — same pair, low light, lifestyle staging
- `9536f6c0….mp4` — wallet insert, 3s rotation reveal (~3s vertical, 928×1920)

Also Find other materials along with them in resources folder
