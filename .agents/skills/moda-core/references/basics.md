# Moda basics — install, auth, update, conventions

## Install and update

| Step | Command |
|---|---|
| Install the CLI | `npm i -g @moda-design/moda` |
| Install the skills into this harness | `npx skills add moda-design/moda` |
| Verify everything at once | `moda doctor --json` |
| Update EVERYTHING — the CLI and the installed skills, one command | `moda update` |

`moda update` is first-party and never elevates. If it prints a command instead of acting, hand
that command to the user and wait. Never pipe curl to sh; never sudo. When doctor says an update is
required, update before doing anything else — the server may refuse an old client outright.

If `moda` is missing from PATH, stop and give the user the install command rather than improvising
a substitute for the artifact you could not build.

## Auth

- Interactive: `moda auth login` — opens a browser, and the credential lands in the OS keychain.
- Headless or CI: mint a key at **moda.app/cli/auth**, then `moda auth login --paste`, or set
  `MODA_API_KEY` in the environment. No verb ever prints a credential back, and you never handle
  one directly.
- `moda doctor` names the signed-in identity and the active org. Org = whose workspace and billing
  the work lands in. Switch only on an explicit request: `moda org list`, then `moda org use`.

## Credits and spend

`moda account status` — plan, credits remaining, and the active org. `moda account usage` — usage
over time. `moda account costs` — what meters and what does not, from the server's entitlement
summary rather than anyone's memory. Deterministic verbs report zero metered credits; believe them,
because authoring, editing, screenshots and exports really are free. Each metered call returns a
usage receipt on its result; report it as information, never as a warning.

## Self-description and troubleshooting

- `moda describe <verb> --json` — any verb's ground-truth schema, with its mutating, destructive
  and metered markers. Trust it over memory, and over this file.
- `moda docs` — the full guide set. `moda last-error` — re-prints the last failure's whole envelope
  (type, code, message, hint, request id) when your scrollback swallowed it.
- Typed errors carry actionable hints. Follow the hint; on the same code twice, stop and ask an
  expert with `moda ask --context "<the error>"`.

## Result conventions

- Decide from `--json`, not the human summary — the summary omits caveats.
- Big results: `--output FILE` keeps a large read or list out of your context; the file holds the
  full payload while the terminal shows a bounded preview.
- **A list result is a PAGE, not the universe.** Check `total` / `has_more` before telling the user
  how many things they have, and continue with the lane's own flag (`--all` caps at 500). Where the
  server reports no total, say "at least N" — never "N total".
- Ids and URLs are copied verbatim, never retyped or reconstructed.

## Repo defaults — the repeat-work lane

`.moda/context.json` pins the org, brand kit, and canvas per repository, so every run inside that
repo lands in the right workspace with the right brand and no flags: `moda context show` prints the
effective values and where each came from, `moda context set` writes one, `moda context clear`
removes it. Full recipe: load moda-context.

## Working through the Moda connector instead

The same capabilities are exposed as tools when Moda is connected to a chat host. The map:

| CLI | Connector |
|---|---|
| install / `moda update` / `moda doctor` | `moda_bootstrap` once — tools and skills are served by Moda and always current; there is no install or update step |
| `moda auth login`, key minting | the host's OAuth connection; nothing to do in-session |
| `moda org use` | a `team` argument on the tools that take one |
| `moda describe`, `moda docs` | each tool's own description, plus the loadable skill guides |
| `moda last-error` | the typed error on the tool result, with its hint |
| `moda account status` | bootstrap reports plan and remaining credits |
| `moda ask` | the expert tool, with the same question / context / thread shape |
| `moda context` | not available — chat sessions hold no repo config; pass refs per call |
