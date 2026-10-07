# Research reports — researched-document genres

The genre layer for research deliverables: nine document types a "research this and write it up" ask actually is, each with its objective, its research phase, its canonical structure, and its scope calibration. Search mechanics and data honesty live in references/web.md; page craft in references/document-design.md. Business-document genres (proposal, executive brief, press release, case study) and the two regulated genres with mandatory disclaimers live in references/document-playbooks.md.

Research runs on `moda web search` and `moda web read` (metered — say you are searching and surface the receipt). The query patterns below are written as search strings: `site:` operators work, and specific entity + facet + qualifier queries beat whole questions.

---

## Buying guide

Triggers: best, top, buying guide, product comparison, tool comparison, which tool, which product, recommend a, recommendation for, best option, shopping for, looking for a, what should I buy, what should I use, best for, top picks, which one should I, help me choose.

### Objective

Help the user pick the right product or tool for *their* situation — an evaluation against criteria that matter to them, not a generic top-10 listicle.

This covers products, tools, software, hardware, and equipment — things with comparable features, published pricing, and abundant reviews. For hiring service providers (agencies, consultants, freelancers), use the provider-search playbook below instead.

### Phase 1: Research

#### Extract the user's needs first

Use case (not "project management" but "tracking tasks for a 12-person engineering team"), must-haves vs. nice-to-haves, budget signal, scale, constraints (existing stack, compliance, skill level). If the query is vague ("best CRM"), build reasonable assumptions and state them explicitly in the document. If it's specific ("best CRM for a 5-person sales team under $50/month that integrates with Gmail"), use those constraints as primary filters.

#### Research the decision framework first

Before evaluating specific products, research how to think about the category:

- `"how to choose a [category]"`, `"[category] buying guide what to look for"`
- `"what to know before buying [category]"`, `"[category] explained" for beginners`
- `site:wirecutter.com "[category]"`, `site:rtings.com "[category]"` — expert reviewers have the best category explainers

Identify: the key axes of comparison experts use (for monitors: panel type, color gamut, refresh rate, brightness; for CRMs: pipeline customization, automation depth, integrations, reporting granularity), which axes matter most for *this* use case, overhyped features and overlooked ones, and recent shifts that make older advice outdated.

#### Search strategy

Run diverse queries — one `moda web search` per query, not one query rephrased:

- Discovery: `"best [category] for [use case]"`, `"top [category] for [audience]"`
- Comparison: `"[option A] vs [option B] vs [option C]"`, `"[category] buyer's guide"`
- Review sites: `site:g2.com "[category]"`, `site:capterra.com "[category]"`, `site:reddit.com "best [category]"` (Reddit has the most honest user opinions)
- Expert reviewers: `site:wirecutter.com "[category]"`, `site:rtings.com "[category]"`, `"[category]" review site:pcmag.com`
- Pricing: `"[product] pricing"`, `"[product] free plan"`

Two rounds: broad (discover 10-20 candidates), then targeted (deep-dive the top 5-8 — pricing pages, detailed reviews).

#### Source priority for reading

1. Expert review sites — Wirecutter, RTINGS, PCMag, domain-specific reviewers (hands-on testing)
2. Aggregators — G2, Capterra, TrustRadius (review volume, category comparison data)
3. Reddit/forum threads — real users on trade-offs
4. Official product pages — features, pricing, integrations
5. Comparison blog posts — often affiliate-driven; cross-reference before adopting a claim, and note the bias

Per option, research: capabilities against the user's use case; all pricing tiers plus hidden costs (implementation, add-ons, per-seat minimums, overage, migration); real user sentiment; explicit limitations; integration fit.

### Phase 2: Writing

#### Document structure

1. **Recommendation Summary** — lead with the answer: "Best overall: X. Best for [use case A]: Y. Best budget option: Z." 3-5 tiered picks with a one-sentence rationale each; actionable on its own. Never a single pick.
2. **How to Think About [Category]** — the Wirecutter-style preamble: key axes, which matter most here, common misconceptions, recent shifts. Equips the reader to evaluate options not in the report. Brief if they gave detailed technical requirements; deeper if they asked broadly.
3. **How We Evaluated** — 1-2 short paragraphs: which criteria were weighted most and how options were filtered.
4. **Quick Comparison** — table of all finalists, descriptive values rather than checkmarks ("Free tier + $29/mo Pro", not "$$"):

   | Option | Best For | Price Range | Key Strength | Key Limitation |
   |--------|----------|-------------|--------------|----------------|
   | ...    | ...      | ...         | ...          | ...            |

5. **Detailed Reviews** — 5-8 finalists, strictly parallel structure: **What it is** (1-2 sentences), **Why it stands out** (2-3 bullets tied to the user's needs), **Where it falls short** (1-2 honest bullets), **Pricing** (relevant tiers), **Best for** (one sentence).
6. **What to Watch Out For** — hidden costs, gotchas, questions for a trial/demo, migration and contract traps.
7. **Final Verdict** — expanded summary, 2-3 sentences of reasoning per pick, plus "If none of these fit because [edge case], consider [alternative approach]."

Give pricing as exact figures with the tier math: "$49/seat/month with a 5-seat minimum ($245/mo total)", plus annual discounts — never "mid-range" or "$$".

#### Citations

Inline markdown links: `[Source Name](url)`. Pricing claims link to the pricing page; review scores to the platform. Pricing goes stale — link the source and tell the reader to verify. Include a **Sources** section.

### Scope calibration

- **Quick pick** (2-3 options the user named): skip discovery — detailed reviews + Quick Comparison + Final Verdict.
- **Standard guide** (open-ended "best X for Y"): full structure, 5-8 finalists from 10-20 candidates.
- **Exhaustive guide** (high-stakes purchase): expand reviews, add a dedicated pricing comparison, a runner-up tier, and a "questions to ask during evaluation" section.

---

## Provider search

Triggers: find a, hire a, looking for an agency, need a consultant, find a freelancer, recommend an agency, need a contractor, hire someone to, find a firm, looking for a service, find a provider, need help with, who can, find someone to, looking to hire, need an agency, local service.

### Objective

Help the user find the right service provider — agency, consultant, freelancer, firm, or local service. The deliverable is a **qualified shortlist** with evidence of fit for each provider, plus an **evaluation framework** for the user's next step (intro calls, proposals, references). Desk research narrows the field; the user decides through direct interaction. Say that limitation explicitly in the document, and never name a single "best" provider.

### Phase 1: Classify the request

- **Specialized professional services** (PR, design agency, law firm, accountant, consultant): huge, poorly indexed option space; the work is not publicly attributable, so quality must be inferred from indirect signals.
- **Creative/portfolio services** (designer, photographer, videographer, web developer): work IS visible — Strategy 2 works best.
- **Local/commodity services** (plant care, cleaning, catering, IT support): small, geographically bounded; direct search surfaces the full set.

Then extract: the exact job (not "PR" but "announce a Series A to tech press"), scale/budget signals, location constraints, and required domain fit.

### Phase 2: Research

#### Research the domain first — become an informed buyer

Before searching for names, research how to hire for this service. This is often the most valuable part of the report — it stays useful even if the user ends up hiring through a personal referral.

- `"how to hire a [service type]"`, `"what to look for in a [service type]"`, `"[service type] mistakes to avoid"`, `"[service type] red flags"`
- `"[service type] [year]" trends OR changes` — what's different about hiring this now vs. 2-3 years ago — plus VC/founder/industry blog posts about hiring this type of provider

Synthesize: what separates a great provider from a mediocre one in *this* domain, what has shifted recently (AI disruption, pricing, delivery models), what makes a fit vs. misfit (a brilliant consumer PR firm is wrong for B2B devtools regardless of talent), and what experienced buyers wish they'd known.

#### Strategy 1: Direct discovery (all types, start here)

- `"[service type] for [industry/use case]"` (e.g. "PR agency for tech startups"), `"best [service type] [location]"`
- `"[service type] [specific need]"` (e.g. "Series A announcement PR"), `"how to choose a [service type]"`

Results are heavily SEO-gamed: whoever ranks first is best at marketing *themselves*. Note this in the report.

#### Strategy 2: Work backwards from output (creative/portfolio services)

- `"best [output type] examples [year]"` (e.g. "best developer tools landing pages 2025"), `"who designed [admired example]"`, `"[output type] agency portfolio [domain]"`

Fails where the work is uncredited (PR, consulting, legal); highest-signal everywhere else.

#### Strategy 3: Community and peer recommendations

- `site:reddit.com "[service type] recommendation"`, `"[service type]" recommendation site:news.ycombinator.com`, `"[service type] for [industry]" forum OR community`
- Also: VC blogs recommending providers to portfolio companies, industry association directories, "how I hired a [service type]" posts.

#### Strategy 4: Evaluate the shortlist directly

With 8-15 candidate names, read their sites for: relevant portfolio/case studies with measurable results, client list (right type and scale?), team size and specialization, engagement model, and thought-leadership content (strong signal of domain knowledge).

#### Source priority for reading

1. Provider websites — portfolio, case studies, client list, team, services
2. "How to choose a [service type]" articles — evaluation frameworks from experienced buyers
3. Industry directories — Clutch, DesignRush, industry lists. **Pay-to-play**: use for discovery only, never treat rankings as endorsements, and say so in the report
4. Community threads with firsthand hiring accounts
5. Provider blog/thought-leadership content

### Phase 3: Writing

#### Determine solution categories first

Before profiling individuals, present the categories of approach — the user may not have considered them all. Include non-obvious ones (freelancer marketplaces like Toptal/Arc.dev, niche job boards, industry Slack channels, DIY).

| Approach | Typical Cost | Best When |
|----------|-------------|-----------|
| DIY with a template/builder | $0-500 | Budget is tight, team has some design sense |
| Freelance designer | $2K-10K | Defined scope, want quality without agency overhead |
| Specialized agency | $10K-50K | Need strategy + execution, have budget |
| Full-service agency | $25K-100K+ | Complex needs, ongoing relationship |

#### Document structure

1. **Summary & Top Picks** — 3-5 recommended providers, one-line rationale each, with their category.
2. **How to Think About Hiring [Service Type]** — the domain briefing from above, written so the reader can evaluate *any* provider they encounter. Calibrate depth to their sophistication.
3. **Solution Approaches** — the categories table plus trade-offs, so the user picks *what kind* before *which one*.
4. **Shortlisted Providers** — 5-8 subsections, parallel structure: **What they do** (1-2 sentences), **Why they're a fit** (2-3 bullets of specific evidence — portfolio pieces, client types, domain expertise), **Watch out for** (1 honest caveat), **Engagement model** (project/retainer/hourly, typical scope).
5. **How to Evaluate** — the most important section for services: 5-8 questions to ask on intro calls, what to look for in proposals (scope, timeline, pricing structure, team assignment), red flags, and which references to request.
6. **Additional Options** — 1-2 sentences each on near-misses worth exploring.

Prefer a specialist over a "full-service agency that also does [need]" — the specialist is almost always the better fit.

**Citations**: inline markdown links for factual claims; portfolio examples link to the actual work, client claims to case study pages. Include a **Sources** section. Flag any rating that comes from a pay-to-play directory.

### Scope calibration

- **Local/commodity service**: skip Solution Approaches — shortlist the real options, compare pricing/services, recommend.
- **Defined project** (landing page, logo, video): full structure, emphasis on portfolio evidence and solution categories.
- **Complex/ongoing engagement** (PR firm, consulting partner, law firm): full structure with extra weight on How to Evaluate.

---

## Company research

Triggers: company research, company overview, company analysis, company profile, company deep dive, research this company, what does this company do, company background, organization overview, company report, account research, target account, prospect research, account plan.

### Objective

Profile a single company for the user's specific purpose. The same company reads very differently to a sales team targeting it than to a candidate interviewing there — detect the intent and calibrate the searches, sources, and structure to it. Never produce the same profile regardless of intent.

### Phase 1: Research

#### Identify the use case first

- **Sales / ABM targeting** (most common): strategic priorities, pain points, decision-makers, internal tech stack, recent changes that create openings.
- **Investment screening**: business model, revenue/growth, market position, moat, risks, valuation context.
- **Job / interview prep**: culture, trajectory, leadership, team/role context, interview process.
- **Partnership evaluation**: stability, reputation, strategic direction, alignment.
- **General knowledge**: balanced overview.

If intent is ambiguous, default to a general overview and state the assumption.

#### Search strategy by use case

**Sales / ABM:**
- `"[company] strategic priorities"`, `"[company] investor day"`, `"[company] earnings call [year]"` — earnings calls and investor decks are the best source for what they're focused on
- `"[company] leadership team"`, `site:theorg.com "[company]"`, `site:linkedin.com "[company]" VP OR Director OR Head of [relevant function]"`
- `"[company] tech stack"`, `site:stackshare.io "[company]"`, `"[company] engineering blog"`, `"[company]" jobs "[relevant technology]"`
- `"[company] launches"`, `"[company] partnership"`, `"[company] announcement [year]"`
- `"[company] challenges"`, `"[company]" "looking for" OR "investing in" OR "migrating to"`

**Investment screening:**
- `"[company] revenue"`, `"[company] earnings [year]"`, `site:sec.gov "[company]"` (if public)
- `"[company] market share"`, `"[company] competitors"`, `"[company] vs"`
- `"[company] growth"`, `"[company] expansion"`, `"[company] new market"`
- `"[company] risks"`, `"[company] regulatory"`

**Job / interview prep:**
- `"[company] culture"`, `site:glassdoor.com "[company]"`, `"what it's like to work at [company]"`
- `"[company] news [year]"`, `"[company] layoffs OR hiring OR growth"`
- `"[company] interview process"`, `site:teamblind.com "[company]"`
- `"[company] [team/role] engineering blog"`

**All use cases:** official site and about page, Crunchbase/PitchBook, news from the last 3-6 months, LinkedIn company page for headcount and growth signals.

#### Source priority

| Source | Sales/ABM | Investment | Job Prep | General |
|--------|-----------|------------|----------|---------|
| Earnings calls / investor presentations | Primary | Primary | Low | Medium |
| Leadership pages / TheOrg / LinkedIn | Primary | Medium | Medium | Medium |
| Job postings (for tech stack signals) | Primary | Low | Medium | Low |
| SEC filings / annual reports | Medium | Primary | Low | Medium |
| Glassdoor / Blind / culture content | Low | Low | Primary | Medium |
| Official product pages | Medium | Medium | Low | Medium |
| Engineering blog / tech blog | Medium | Low | Medium | Low |
| News articles | Medium | Medium | Medium | Primary |
| Crunchbase / PitchBook | Medium | Primary | Medium | Medium |

**Tech stack:** searching "[company] tech stack" returns what they *sell*, not what they *use*. For sales targeting you want the latter — job postings, engineering blog posts, StackShare profiles, and conference talks by their engineers.

**Employee reviews** are noisy and individual: valuable for job prep only, and only when corroborated across several reviews or sources. Don't use them for sales or investment.

### Phase 2: Writing

#### Document structure

1. **Company Snapshot** — 3-5 bullet standalone executive summary, angled to the use case (priorities and product relevance for sales; financial position for investment; culture and trajectory for job prep).
2. **Company Overview** — what they do, who they serve, how they make money, market position. 1-2 factual paragraphs; the foundation, not the insight.
3. **[Use-case-specific core section]** — the section that varies most:
   - **Sales/ABM → "Strategic Priorities & Opportunities"**: focus areas from earnings calls, press releases, and job postings; recent initiatives; likely pain points; explicitly why the user's product is relevant. Include a subsection naming decision-makers in the relevant buying function.
   - **Investment → "Financial Profile & Growth"**: revenue, growth, margins, key metrics, valuation context, competitive position, risks.
   - **Job prep → "Culture & Working Environment"**: what employees say, stated values and whether they seem authentic, trajectory, leadership style, interview process.
   - **General → "Strategy & Market Position"**.
4. **Leadership & Organization** — named executives with titles and context. For sales, focus on the buying function.
5. **Recent Developments** — dated entries from the last 3-12 months, most recent first.
6. **Key Takeaways** — synthesis: for sales, how to approach the account; for investment, bull and bear; for job prep, what to expect and ask about.

Date everything ("As of Q4 2025 earnings…") — company information goes stale fast. Note the gap when what the company says diverges from what's observable. For sales, connect the dots explicitly: "Their Q4 earnings call emphasized reducing cloud costs, which aligns directly with [user's product's] value proposition."

#### Citations

Inline markdown links naming the source type — "According to their [Q4 2025 earnings call](url)…" or "Per [Glassdoor reviews](url)…" Include a **Sources** section.

### Scope calibration

- **Quick snapshot**: Snapshot + Overview + Recent Developments; skip the use-case section.
- **Standard profile**: full structure.
- **Deep account plan** (sales/ABM with product context): full structure plus expanded decision-maker mapping, tech stack analysis, and a "why we're a fit" section with talking points.

---

## Competitive analysis

Triggers: competitive analysis, competitor analysis, competitor comparison, market comparison, competitor landscape, competitive landscape, compare competitors, competitor research, competitive research, market players, industry comparison, rival analysis, compare tools, competitive overview.

### Objective

Map the competitive landscape and reveal how it's structured. The deliverable is not a feature comparison table — it's a strategic categorization showing the meaningful axes of differentiation, where each player sits, and where the white space is. The categorization IS the analysis; a flat list of equally-weighted competitors is a failure mode.

### Phase 1: Research

#### Discover the full competitive set

Not just symmetrical vendors — every way a user might solve the same problem: direct competitors; adjacent players with partial overlap (Canva vs. Figma on some use cases); category-crossing tools converging on the problem (AI agents that generate slides vs. dedicated slide tools); open-source and free alternatives; and DIY/service alternatives (in-house, agency, manual process — note for completeness, don't profile in depth).

Aim for 15-30 entities in discovery; profile a subset in depth.

#### Research existing categorization frameworks first

Don't invent the axes from scratch — search for how experts already segment this market:

- `"[market] market map"`, `"[market] landscape [year]"`, `"[market] ecosystem overview"`
- `"[market] categories"`, `"[industry] competitive landscape analysis"`
- `site:g2.com "[category]"` — G2 category pages reveal how the review ecosystem segments the market

Where sources disagree on categorization, that disagreement is usually where the interesting strategic tension lives.

#### Search strategy

Run diverse queries — one `moda web search` per query, not one query rephrased:

- Landscape: `"[product] competitors"`, `"[product] alternatives"`, `"[market] landscape 2025"`, `"[market] market map"`
- Category: `"best [category] tools"`, `"[category] software comparison"`, `"[use case] solutions"`
- Head-to-head: `"[product] vs"` — leaving the other side blank surfaces what people actually compare it to
- Adjacent: `"[adjacent category] tools that also do [core capability]"`
- Review sites: `site:g2.com "[product]"`, `site:capterra.com "[category]"`

At least two rounds: broad (discover the landscape and categories), then targeted (missing players, unclear positioning, deeper data on the players that matter most).

#### Source priority for reading

1. Official product and landing pages (positioning, messaging, feature set)
2. Review aggregators — G2, Capterra, TrustRadius (sentiment, category placement)
3. Analyst reports, market maps, "landscape" posts (existing frameworks)
4. Product blogs / changelogs (recent direction)
5. News (funding, pivots, acquisitions — trajectory, not core analysis)

#### What to focus on per competitor

Positioning over metadata: what problem they solve and for whom, their core approach (AI-native vs. traditional, opinionated vs. flexible), strengths and weaknesses, trajectory. Founding year, headcount, and funding are supporting context — include only where they illuminate strategy ("$200M Series D signals enterprise push"), never as the headline. **Exception**: if the query is specifically about pricing, funding, or market sizing, that data becomes primary.

### Phase 2: Writing

#### Document structure

1. **Executive Summary** — 3-5 bullets, leading with the structural insight ("This market splits along two axes: X and Y"), not a process description ("We analyzed 25 tools"). End with the strategic implication. The reader should be able to stop here.
2. **Competitive Landscape** — the full set organized into categories, then a narrative on the landscape's shape: how many meaningful categories, which are growing or consolidating, where boundaries are blurring.

   | Category | Players | Notes |
   |----------|---------|-------|
   | AI-native design tools | Tool A, Tool B, Tool C | Fastest-growing segment, mostly Series A-B stage |
   | Legacy design suites | Tool D, Tool E | Established but slow to adopt AI |

3. **Key Axes of Differentiation** — the analytical core. 3-5 *strategic* dimensions, not feature comparisons: consumer/prosumer vs. enterprise; AI-native vs. AI-added-on vs. no AI; professional designers vs. non-designers; all-in-one vs. deep single-purpose; self-serve vs. sales-led. For each, explain what it means, why it matters, and where the key players fall — so the reader can place a competitor the report doesn't cover.
4. **Detailed Profiles** — 5-8 of the most important players, parallel structure: **Positioning** (2-3 sentences), **Strengths** (2-3 bullets with evidence), **Weaknesses** (2-3 bullets with evidence), **Trajectory** (1-2 sentences).
5. **Strategic Analysis** — original interpretation, not restated profile facts: non-obvious trade-offs, where the market is heading, white space, which moats are real vs. illusory.
6. **Recommendations** — situational with risk caveats: "If your priority is X, the strongest options are A and B because…" If a specific product is the subject, address where it's well-positioned, where it's vulnerable, and the biggest opportunities.

Stay balanced on the subject company too — reflexive spin is visible to the reader.

#### Citations

Inline markdown links: `[Source Name](url)`, plus a **Sources** section. When sources conflict, present both and note the discrepancy. When data is unavailable, write "Not publicly available" — never fabricate.

### Scope calibration

- **Quick comparison (2-4 named competitors)**: skip broad discovery; profiles and axes for the named players only, but still include the axes.
- **Standard landscape (5-15 players)**: full structure, 5-8 detailed profiles.
- **Comprehensive market map (15-30+ entities)**: expanded landscape table, more categories, possibly grouped profiles, and a brief market context section (size, growth, trends) before the landscape.

---

## Strategy research

Triggers: growth strategy, go to market, marketing strategy, sales strategy, how to grow, best practices, playbook, strategy for, how do companies, what strategies, how should we, growth tactics, GTM strategy, pricing strategy, content strategy, retention strategy, acquisition strategy, expansion strategy, how to scale, how did they grow.

### Objective

Not generic advice: a synthesis of evidence-backed strategies, named case studies, and a prioritized recommendation tailored to the user's stage, industry, and constraints. Take a position — the user wants a recommendation, not a menu.

If the query is vague ("growth strategies for my startup"), infer the context and state the assumptions explicitly rather than asking.

### Phase 1: Research

Run diverse queries — one `moda web search` per query, not one query rephrased. Mix these patterns:

- Frameworks: `"[challenge] strategy framework"`, `"[industry] [challenge] playbook"`, `"how to think about [challenge]"`
- Case studies: `"how [company] grew"`, `"[company] [strategy type] case study"` — named examples are the highest-value content
- Practitioner content: `"[strategy type]" site:firstround.com`, `site:lennysnewsletter.com`, `site:a16z.com`
- Founder experience: `"[strategy type]" site:reddit.com`, `"[strategy type]" "what worked"`, `lessons learned`
- Data-backed: `"[strategy type] benchmark"`, `"[strategy type] metrics"`

At least two rounds: one for the strategic framework and case studies, one for specific tactics and recent data. Research the framework *before* collecting tactics, so the document is coherent strategies rather than a flat list.

Source priority for reading: named case studies with numbers > practitioner/operator content (First Round, Lenny's, a16z, Reforge, founder blogs) > comprehensive framework guides > benchmark data > listicles.

Extract what specifically was done (not "they did content marketing"), what conditions made it work, what failed, and quantified outcomes.

### Phase 2: Writing

1. **Executive Summary** — the recommendation in 3-5 bullets; actionable on its own.
2. **How to Think About [Strategy Area]** — the landscape of major approaches and what determines which is right.
3. **Strategies** — 3-5 approaches, each with: what it is, who it works for, how it works in practice (3-5 specific tactics), at least one named case study with quantified outcomes, and failure modes. Depth over breadth.
4. **What's Working Now** — recent shifts; what used to work and no longer does. Search current-year content.
5. **Recommended Approach** — tied to the user's stated stage and constraints, sequenced first/second/third, with what to avoid and why.

Distinguish evidence ("freemium companies see 25% higher expansion revenue, OpenView benchmark") from opinion, and note where evidence is thin or may not generalize. Every recommendation must be feasible with the user's budget, team, and time — state what each strategy requires.

Cite factual claims and case study details with inline markdown links: `[Source Name](url)`. Benchmarks link to the original study. Include a **Sources** section.

### Scope calibration

- **Narrow tactical question**: skip the framework section; 3-4 tactics with case studies and a recommendation.
- **Standard**: full structure, 3-5 strategies.
- **Comprehensive playbook**: expanded framework, 5+ strategies, multiple case studies each, phased recommendation.

---

## News briefing

Triggers: what happened, catch me up, news about, latest on, recent developments, news summary, news briefing, current events, what's happening with, update on, latest news, news recap, what's going on with, fill me in, bring me up to speed, what's new with, what did I miss.

### Objective

Get the reader up to speed fast: a chronological synthesis that separates confirmed fact from speculation, explains why events matter, and says what to watch next.

### Phase 1: Research

#### Do not trust your own knowledge

**Never write a factual claim from memory.** Every fact must come from a page you actually read this session (`moda web read`) with a source link — search snippets are for discovery only, never a citable source; if you think you know what happened, search, read, then confirm. What was true six months ago may be completely wrong now — especially for geopolitics, conflicts, elections, corporate restructurings, legal proceedings, and technology releases.

#### Determine the scope

- **Time window** — "What happened with OpenAI?" likely means recent months; "catch me up on the Ukraine conflict" may mean a year+. Default to the most recent significant developments.
- **Depth of context** — does the reader need a "previously on…" primer, or do they clearly know the background?
- **Angle** — "what happened with OpenAI's safety team?" is much narrower than "catch me up on OpenAI."

#### Search strategy

Run diverse queries — one `moda web search` per query, not one query rephrased:

- Recent coverage: `"[topic] latest news"`, `"[topic] [current month/year]"`, `"[topic] developments [year]"`
- Timeline: `"[topic] timeline"`, `"[topic] recap"`, `"what happened [topic] [year]"`
- Key actors: `"[key person] [topic]"` — e.g. `"Sam Altman OpenAI 2026"`
- Specific events: `"[specific event] details"`, `"[specific event] reaction"`
- Multiple perspectives: `"[topic]" site:reuters.com`, `"[topic]" site:bbc.com`, `"[topic]" site:theverge.com` — diversify outlets to avoid single-source framing

At least two rounds: broad (the major developments), then targeted (details on the most important events, additional perspectives on contested claims).

#### Source priority for reading

1. Major news outlets — Reuters, AP, BBC, NYT, Bloomberg
2. Industry outlets — The Verge, TechCrunch, Ars Technica for tech; domain publications otherwise
3. Timeline/recap articles — gold; someone has already done the chronological synthesis
4. Official statements — press releases, company blogs, government announcements
5. Opinion/analysis — useful for "why it matters", but label as analysis, not fact

**Prioritize by article date, newest first.** If you read an older article, frame its claims as historical ("As of June 2025…"), never as current.

Focus on: dated facts and who confirmed them; key actors, what each wants, and where they disagree; cause and consequence; and what's contested — where sources disagree or a claim appears in only one outlet.

### Phase 2: Writing

#### Document structure

1. **Summary** — 3-5 bullets, most recent first, each a complete standalone insight. Enough on its own for a casual conversation. Lead with this, not with backstory.
2. **Context** — the backstory needed for recent events to make sense, the key players and their interests (1-2 sentences each), and what's at stake. 2-4 sentences for a familiar topic, a short paragraph for an obscure one; calibrate to how much the reader's question implies they already know. Skip entirely if the topic is straightforward and they're clearly familiar.
3. **Timeline of Key Events** — the core, oldest to newest:

   **[Date]** — **[Event headline]**
   [2-4 sentences on what happened, cited, noting which facts are confirmed vs. reported by a single source.]

   Group tightly related events under one date. Use horizontal rules or subheadings to separate distinct phases when the timeline is long. Don't cover only the very latest development — include the 2-3 prior events that make it a narrative rather than a fragment.
4. **Current State of Affairs** — where things stand now, what's pending, what's unresolved. Don't just trail off after the last timeline entry.
5. **What to Watch** — upcoming dates (hearings, launches, deadlines), unresolved tensions, decisions not yet made.
6. **Sources**.

Date every claim ("in early February 2026", not "recently"). Label fact vs. interpretation: "the company announced X" vs. "this signals a shift toward Y." Corroborate before stating — multiple outlets → established fact; one outlet → "According to [Source]…"; conflicting → present both — and say explicitly when something is unconfirmed or contested.

#### Citations

Inline markdown links using the publication name, not a bare URL: "According to [Reuters](url)…" Include a **Sources** section.

### Scope calibration

- **Quick catch-up** (single event or narrow topic): skip Context. Summary + Timeline (3-5 entries) + Current State.
- **Standard briefing** (weeks/months): full structure, 5-15 timeline events.
- **Deep briefing** (complex, long-running): full structure with an expanded Background subsection, grouped timeline phases, and a "Key Players" section profiling the main actors.

---

## Person research

Triggers: person research, background on, research this person, tell me about person, meeting prep, biography, profile of, background research, before my meeting with, prep for call with, research before interview, learn about.

### Objective

Not a Wikipedia-style biography — insight into how this person thinks, what they care about, and what's relevant to the user's upcoming interaction.

**Privacy boundary**: publicly available professional information only. No home address, family, or personal social media unless the person is a public figure and it is clearly public. State this boundary in the document.

### Phase 1: Research

Identify the use case first, since it changes depth and angle: **meeting/sales prep** (most common — what they care about professionally, recent activity, conversation hooks), **hiring evaluation** (trajectory, expertise, public work), **journalism** (public record, affiliations, statements), or **general knowledge**.

**Round 1 — establish the basics:**
- `"[full name]" [company/title]` — confirm identity and current role
- `"[full name]" LinkedIn` or `site:linkedin.com "[full name]"` — career history, education
- `"[full name]" [company] site:theorg.com` — org position, reporting structure
- `"[full name]" bio OR about` — official bios, conference speaker pages

**Round 2 — how they think (the high-value round):**
- `"[full name]" interview OR podcast` — long-form interviews are the best source; people speak off-script about what they care about
- `"[full name]" keynote OR talk OR conference`
- `"[full name]" blog OR wrote OR published`
- `site:twitter.com "[full name]"` or `"[full name]" twitter OR X`
- `"[full name]" quoted OR "said" OR "told"`

**Round 3 — fill gaps by use case:**
- Meeting prep: `"[full name]" [topic of the meeting]`
- Hiring: `"[full name]" github OR "open source" OR "side project"`
- Journalism: `"[full name]" [company] news OR controversy OR announcement`

**Do NOT search for "[name] opinions" or "[name] philosophy"** — those queries fail. Read their interviews and writing and extract views from the primary sources.

Source priority for reading: podcast/interview transcripts and show notes > their own writing > official bios > news coverage containing direct quotes > social media (professional context, recent activity) > conference talk descriptions.

### Phase 2: Writing

1. **At a Glance** — 3-5 bullets: name, current title, background in one line, and what matters most for the user's purpose.
2. **Professional Background** — 1-2 paragraphs, reverse chronological, interpreting the *pattern* ("15 years in infrastructure before moving to product, suggesting a technical lens on product decisions"), not listing a resume.
3. **What They Care About** — the core section. Synthesized from interviews, talks, and writing, organized by topic, each claim tied to a dated source: "In a December 2025 20VC podcast they described [specific view]." Never "they care about innovation."
4. **Recent Activity** — last 3-6 months, dated entries: talks, articles, job changes, announcements.
5. **Use-case section** — meeting prep → *Conversation Angles* (3-5 specific topics tied to the user's context); hiring → *Expertise & Contributions*; journalism → *Public Record*.
6. **Sources**.

Prioritize recent over historical. Treat LinkedIn self-descriptions as marketing copy, not primary evidence. If the person has a thin public presence, say so explicitly rather than padding.

Cite every claim about what the person thinks with an inline link to where they said it. The **Sources** section gives each URL a description, not a bare link: `[Internet History Podcast — December 2025 interview covering Datadog founding story and AI strategy](url)`.

### Scope calibration

- **Quick prep**: At a Glance + What They Care About + 2-3 conversation angles.
- **Standard**: full structure.
- **Deep profile**: expanded What They Care About, extended career analysis, plus a Communication Style subsection (technical vs. business, data vs. narrative) inferred from their public content.

---

## How-to guide

Triggers: how to, how do I, step by step, guide to, tutorial, walkthrough, instructions for, process for, setting up, getting started with, how can I, guide for, explain how, what are the steps, how should I, walk me through, teach me how, instructions to.

### Objective

Produce a procedure, not an analysis: sequential steps the reader can follow start-to-finish without having to search for anything else.

### Phase 1: Research

#### Scope the task

Narrow what they want to do ("set up a home server" → "set up a Plex media server on a Raspberry Pi"), read their skill level from the question ("how do I start an LLC?" implies a first-timer; "how do I convert my LLC to an S-corp?" doesn't), and pin down constraints: platform, budget, jurisdiction for legal/regulatory guides, tools already on hand. If the query is vague, assume and say so: "This guide assumes macOS and basic terminal familiarity."

#### Research the framework first

- `"how to [task] guide"`, `"[task] step by step"`, `"[task] tutorial [year]"`
- `"[task] mistakes to avoid"`, `"[task] common mistakes"`
- `"[task] checklist"`, `"[task] requirements"`, `"what you need before [task]"`

From these, extract: the overall shape of the process (major phases and what depends on what — get this before writing steps or the ordering will be wrong), what people get wrong (these become the warnings), what's changed recently (old tutorials often describe a harder path that's no longer necessary), and the decision points where the reader must choose between options.

#### Search strategy

Run diverse queries — one `moda web search` per query, not one query rephrased:

- Official docs: `"[task]" site:[official-docs-domain]`, `"[tool] documentation getting started"`
- Tutorials: `"[task] tutorial [year]"`
- Community: `site:reddit.com "[task]"`, `site:stackoverflow.com "[task]"` — what people ask reveals what's confusing
- Troubleshooting: `"[task] troubleshooting"`, `"[task] not working"`, `"[task] error"`
- Video: `"[task] tutorial" site:youtube.com` — titles and descriptions outline the steps without watching

Two rounds: broad (the process and the best guides), then targeted (details on specific steps, troubleshooting for tricky parts).

#### Source priority for reading

1. Official documentation and guides
2. Well-structured tutorials from reputable sites
3. Stack Overflow / community Q&A — reveals what confuses people; these become your warnings
4. Government/official process pages — always the primary source for regulatory/legal how-tos
5. Recent blog posts — verify against official docs

**Prefer the most recent sources.** A 2023 tutorial for a tool updated three times since may be actively harmful. Check publication dates and cross-reference official docs.

### Phase 2: Writing

#### Document structure

1. **What You'll Accomplish** — one paragraph: what they'll have at the end, how long, what it costs. "By the end of this guide, you'll have a working Plex server on your Raspberry Pi. Estimated time: 2-3 hours. Cost: ~$80 for hardware."
2. **Prerequisites** — everything needed before starting, front-loaded, never buried inside the steps: required knowledge, tools/materials (specific: "a Raspberry Pi 4, a microSD card (32GB+), a power supply…"), accounts or access, and estimated time and cost per phase. Date-stamp here too: "Accurate as of [month/year]; if the interface has changed, check [official docs link]."
3. **Overview of Steps** — the major phases only, as a mental map: "1. Set up the hardware → 2. Install the OS → 3. Configure Plex → 4. Add your media library → 5. Connect clients"
4. **Detailed Steps** — one section per phase, numbered sub-steps within:

   **Step N: [Action verb] — [what they're doing]**

   - What to do — specific and unambiguous ("Click the blue 'Deploy' button in the top-right corner", not "deploy your application")
   - What they should see afterward, so they can confirm it worked
   - The exact command, snippet, or value to enter, copy-pasteable

   One action per step. At decision points give the trade-off and a default rather than listing every option: "Install via Docker (simpler, recommended for beginners) or natively (more control). This guide covers both — pick one and follow that path."

   Put warnings *before* the step where the mistake happens:

   **⚠️ Common mistake:** [what people do wrong and how to avoid it]

5. **Verification** — a concrete test for the whole thing. "Open a browser and go to `http://[your-ip]:32400/web`. You should see the Plex dashboard."
6. **Troubleshooting** — the 3-5 most common problems, sourced from Stack Overflow, Reddit, and forums. "Problem: [symptom] → Solution: [fix]."
7. **Next Steps** — further configuration, related guides, official docs for deep dives.

Include steps that seem obvious to you but aren't to a beginner, noting that experienced readers can skip ahead.

#### Citations

Inline markdown links to official documentation; commands and configurations link to the relevant docs page where possible. **Sources** section lists official docs, tutorials referenced, and community troubleshooting resources.

### Scope calibration

- **Quick how-to (3-5 steps)**: skip the Overview, 1-2 lines of Prerequisites, steps + verification.
- **Standard guide (5-15 steps)**: full structure.
- **Comprehensive guide (complex multi-phase)**: expanded Overview, phase-by-phase organization, documented decision points, robust Troubleshooting, and possibly a "Before You Begin" narrative on the overall approach.

---

## Topic explainer

Triggers: explain, what is, how does, help me understand, overview of, introduction to, primer on, explain like, ELI5, crash course, deep dive into, guide to understanding, breakdown of, teach me about, understanding.

### Objective

Leave the reader with a working mental model, not a collection of facts — from "I've heard of this" to "I could explain this to a colleague."

### Phase 1: Research

Gauge the audience level from the query: **beginner** ("what is transfer pricing?") → first principles, define every term; **intermediate** ("how does transformer attention actually work?") → skip the 101, go to mechanisms and nuance; **contextual** ("kubernetes networking for someone who knows Docker") → meet them at the stated starting point. If ambiguous, default to beginner.

Run diverse queries — one `moda web search` per query, not one query rephrased. Mix patterns:

- Foundational: `"what is [topic] explained"`, `"[topic] for beginners"`, `"[topic] explained simply"`
- Mechanics: `"how does [topic] work"`, `"[topic] under the hood"`, `"[topic] architecture"`
- Expert explainers: `"[topic]" site:wikipedia.org`, `"[topic] explained" site:youtube.com` (titles reveal good pedagogical angles), `"[topic]" primer OR tutorial`
- Conceptual aids: `"[topic] diagram"`, `"[topic] analogy"`, `"[topic] vs [related concept]"` — comparison is one of the best explanatory tools
- Real-world: `"[topic] examples"`, `"[topic] use cases"`, `"why does [topic] matter"`

Two rounds: foundational understanding, then depth (misconceptions, advanced considerations, recent developments).

Source priority for reading: high-quality educational content (Wikipedia for structure and breadth, expert explainer posts) > official docs or specs > expert blog posts and talks (best analogies and mental models) > "vs" comparison articles > recent overviews for fast-moving topics.

### Phase 2: Writing

Build bottom-up: each section must be comprehensible from what came before it. Define a term the first time it appears; explain a prerequisite concept before the concept that depends on it.

1. **In Brief** — one paragraph with the essential definition and why it matters, pitched slightly below the reader's assumed level.
2. **Why It Matters** — the problem it solves, anchored in a concrete scenario ("if you've ever experienced X, that's because of Y") or in who is affected and what's at stake.
3. **How It Works** — the explanatory core, broken into components or steps. Use analogies (and say where each breaks down), concrete examples, comparisons to what the reader already knows, and text-described diagrams for spatial or hierarchical structure. Layer it: simplified version first, then the nuance.
4. **Key Concepts** — brief consistent definitions of sub-terms; a glossary the reader can scan back to.
5. **Common Misconceptions** — where the intuitive understanding breaks down. Often the most valuable section, because it stops the reader leaving with a plausible but wrong model.
6. **Current State & Recent Developments** — skip entirely for stable topics (e.g. how TCP works).
7. **Going Deeper** — 3-5 key texts, authoritative sources, or communities.

Explain *why*, not only what: "TCP uses a three-way handshake *because* both sides need to confirm they can send and receive." Where something is genuinely hard, say so — a simplification that is technically wrong is worse than an accurate explanation that takes more work.

Cite specific facts and data points inline with `[Source Name](url)`. Synthesized explanatory prose does not need per-sentence citations; link the best explanatory sources in "Going Deeper."

### Scope calibration

- **Quick definition**: an expanded "In Brief" only, no deep structure.
- **Standard explainer**: full structure, 5-8 minute read.
- **Deep dive**: expanded "How It Works" with multiple depth levels, more key concepts, substantial "Going Deeper."
