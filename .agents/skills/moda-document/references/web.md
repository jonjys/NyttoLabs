# Web research — `moda web` (metered)

Moda's research lane: structured web search and clean page-to-markdown reads.
Metered like the media verbs, with an exact usage receipt (`usage` on every
response). Real facts make better deliverables, so research when the work
needs it. Never an invisible fallback: say you are searching the web and
surface the receipt per the UX rules.

```
moda web search "QUERY" [--results N] [--full-text]
moda web read URL
```

## When to use it (vs. your harness's own browsing)

Reach for `moda web` when it beats what your harness gives you natively:

- **No browsing at all** in this harness → `moda web` IS your web access.
- **Clean extraction**: `moda web read` returns the page as markdown —
  article text, headings, tables, links — with navigation chrome, cookie
  banners, and boilerplate stripped. Prefer it over screen-scraping a
  rendered page when you need the CONTENT of a specific URL.
- **Structured search**: `moda web search` returns machine-readable results
  (`url`, `title`, `snippet`, sometimes `published_at`) instead of a search
  page to parse — use `--json` and read the fields.

Skip it when the facts are already in front of you (the repo, a file the
user named, your own knowledge that needs no verification) or when a
harness-native lookup genuinely suffices.

## Verb rules

- `moda web search "query"` — up to 10 results, default 5 (`--results N`).
  Write specific queries (entity + facet + qualifier), not whole questions.
- `--full-text` adds extracted page text to every result in one call.
  Snippet-first then targeted `moda web read` of the best 1–3 URLs is
  usually the better research shape; use `--full-text` when you need the
  text of most results at once.
- `moda web read URL` — one page → `{url, title, content_markdown, links}`.
  `links` (when present) gives you the page's outbound URLs for one more
  targeted hop; do not crawl breadth-first.
- Typed errors follow the standard exit contract: an unreadable or blocked
  page is not retryable-by-loop — try once more with a different URL from
  the search results, then report what you could not reach. Billing
  prechecks exit with the cap in the message; surface the hint verbatim.

## Research workflow

1. **Search** once with a specific query; scan titles/snippets/dates.
2. **Read** the best 1–3 URLs — not all of them.
3. **Extract** what the deliverable needs (numbers, quotes, dates) while the
   markdown is in front of you; note the source URL per fact.
4. Iterate with a REFINED query only if a real gap remains — two searches
   that differ only in phrasing find the same pages.

## Data honesty

When the deliverable IS the research — a briefing, a buying guide, a
competitive analysis, a company or person profile — the genre decides what to
search for and how the finished document is shaped: load the research-reports
reference (it ships with moda-document) before planning the searches.

Facts you place in a deliverable must come from a page you actually read in
this session — never from a snippet alone when the number matters, and never
invented. Prefer primary sources (the company's own site, the paper, the
docs) over aggregators; check `published_at` when recency matters. Cite or
name sources in the deliverable where the format allows.
