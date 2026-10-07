---
name: moda-audio
description: >-
  Generate audio on Moda: voiceover/TTS, narration, music, jingles, sound
  effects — up to 10 minutes per render, delivered as a file (no canvas
  slot). Use for: voiceover, narration, "read this aloud", jingle,
  background music, SFX. Pairs with moda-video-clip for scored
  video. Metered.
argument-hint: "[what to say or play + voice/style] [--duration S]"
allowed-tools: Bash(moda:*), Read
---

# moda-audio

<!-- moda:banner -->
**PREREQUISITE — load `moda-core` once per session** (step-0, write contract,
free/metered map). Already loaded? Skip ahead. If you cannot load it, the
non-negotiables: run `moda doctor --json` before anything; `moda brand list`
before creating; writes that pin a revision use your last read's — on
`stale_revision`, re-read and retry once (it heals); send the canvas link the
moment it exists; stuck or failed? `moda ask "<question>"` — free and fast,
never guess.
<!-- /moda:banner -->

## Set the expectation first

Audio is a FILE, never a layer. A design has no audio slot: you cannot place a
track on a canvas page, and a page exported to mp4 carries only the audio baked
into its video fills. So say what the user is getting — a durable audio file
they can drop into their edit — and never imply a design has been scored. Two
places DO consume a track: a video CUT's Main Edit timeline takes uploaded
audio as real audio-track clips, muxed into the cut's export — the moda-video
family owns that placement — and
`moda media generate-video --reference-audio` on the models whose card declares
it (there the clip is TIMED to the track: the track's length is the clip's).

## Modes — stated, never inferred

| Ask | Mode | What the prompt is |
|---|---|---|
| voiceover, narration, "read this aloud" | `--mode text_to_speech` | the SCRIPT, spoken verbatim — no "read this in a warm voice" (Eleven v3 audio tags are the one exception, below) |
| jingle, background music, a bed | `--mode text_to_music` | a description: genre, instrumentation, mood, tempo |
| sound effect, ambience, sting | `--mode text_to_sfx` | a description of the sound |
| re-voice a recording (keep the delivery, change the voice) | `--mode speech_to_speech` | none: `--source-audio` is the performance (managed voices only, below) |

## The recipe

1. `moda media models` — the audio cards: which modes each model serves, its
   duration envelope, prompt-character ceiling, take limit, preset voices, and
   its BILLING BASIS. `--model` is required; there is no "auto".
2. Write the script or description. Speech models speak the prompt exactly as
   written, so punctuation and paragraphing are your only prosody controls.
3. Pick the voice: `--voice` takes one of the card's presets; where a card
   lists none and marks the mode free-form, it takes any provider voice name or
   cloned-voice id. For narration, cast it and record it as below.
4. **Ask for the shortest length that serves the deliverable.** `--duration`
   applies to music and sfx only (speech is as long as the script reads) and
   snaps into the model's range. Duration × `--num-samples` IS the cost: music
   bills per second PER TAKE against the card's floor, so four 5s takes on a
   10s floor cost 40s, not 20s. Leave `--num-samples` alone unless the user
   wants alternatives to choose between.
5. Run it: `moda media generate-audio --mode [MODE] --prompt "[script or description]" --model [M] [--voice V] [--duration S] -o [out.mp3]`.
   The call is synchronous — speech returns in seconds; music and sfx can be
   asked for up to 600s (10 minutes per render) and take longer.
6. A render that outruns the wait comes back as a RETRYABLE error, not a loss:
   re-run the identical command to collect it — that adopts the existing job and
   can never pay twice. Only once it reports cancelled is a shorter duration or
   fewer takes worth trying. The ElevenLabs models are the exception: they render
   inside the call, so an overrun is `submission_uncertain` — do not re-run it;
   ask for a shorter track or script instead.

## Narration that sounds like a person

A flat or odd voice spoils a finished video and costs another take, so cast the
voice deliberately and let the user hear it before recording the whole script.

- **Only when wanted.** Narrate when the user asked, or said yes to an offer.
  Where a video would clearly be better narrated, offer it with music as the
  alternative; never add a voiceover on your own. Silence or music is the default.
- **Cast it.** A voice the user named or used before wins. Otherwise decide from
  the brand, audience and script (gender, age, accent, energy, warmth), and
  default to a natural, conversational read. Avoid breathy, whispery, sultry or
  movie-trailer voices unless asked: those come across as creepy. ElevenLabs
  presets to start from — warm conversational woman: Jessica, Matilda, Sarah;
  British woman: Lily, Alice; deep warm man: Brian, Eric; casual man: Chris,
  Will, Liam; authoritative or documentary: Daniel, George, Bill; neutral: River.
  Pass `language_code` in `--model-params` for anything but English.
- **Audition when you can ask.** If you can ask the user (a question tool or a
  live chat), first ask the voice (Woman / Man / You decide) and tone (Warm,
  Calm, Upbeat, Formal, You decide), skipping what the brief already answers.
  Then have 2–3 fitting voices read the same opening line or two (about a cent
  each on v4), save each with `-o` (e.g. `auditions/jessica.mp3`), hand over the
  paths and ask which one, with the script in the same message so the words and
  voice are approved together. Record the full script only after the pick. A
  named voice, "you decide", "just go ahead" or an unattended run skips this:
  pick from the casting, name the voice in the handoff, offer a swap.
- **Record one performance.** Final narration on `elevenlabs-eleven-v4`;
  `elevenlabs-eleven-v4-turbo` (half the price) is for auditions and drafts, and
  never a v2.5 flash tier (built for latency, it reads flatly). MiniMax Speech HD
  only when the script needs its pronunciation or pause controls. Generate the
  WHOLE script in one call, never sentence by sentence and stitched: each line
  then starts cold, which is exactly what sounds robotic. v4 takes 10,000
  characters per call; past that, split at paragraph (else sentence) breaks,
  passing `previous_text`/`next_text` in `--model-params`, join the parts into one
  file and `moda file upload` it. Mark breaks in the text (line breaks, an
  ellipsis); don't speed the voice up to fit a duration — trim the script
  instead (v4 has no speed control). Direct it with a few audio tags (`[warmly]`
  at the start, `[excited]` on the reveal; v4 also takes short directions such
  as `[quietly curious]`). `stability` 0.5 is natural; lower is more
  expressive, higher drifts toward monotone. v4's launch price runs to
  2026-10-12 (UTC): `moda media models` shows `promo_until` while it does.
- **Check the take.** Its length should fit the script (about 2.5 words a
  second); where you have a speech-to-text tool, transcribe it and confirm the
  words and the brand name. A rejected voice ("deeper", "less creepy") is the new
  casting: audition again if still open, then re-record the whole script.

## Managed voices (`elevenlabs-native-…`)

Moda's own voice lane: a catalog of `vox_…` voices, workspace pronunciation
dictionaries, re-voicing a recording, and character timings with every text
take. `moda voice capabilities` lists these models (they are not on
`moda media models`) with the only `--model-params` each takes; when it says
`UNAVAILABLE`, use a model from `moda media models` instead.

- **Cast from the catalog.** `moda voice search --language en --accent british --use-case narration`
  (every `--query` word must match); `moda voice show vox_…` adds a free preview
  URL; `moda voice favorites` holds saved picks and the workspace default. On
  these models `--voice` takes only a `vox_…` id, never a name.
- **Quote, then generate.** `--quote` prices a take for free and starts nothing;
  pass `--max-credits N` on the real call to hold it to the figure approved.
- **Audition in parallel.** `--no-wait` hands back a `task_…` at once: start one
  per candidate on the same opening line, then `moda task status TASK --wait`
  each and `moda file download file_… -o …` the takes. `moda task cancel TASK`
  is free until the request reaches the provider; after that the take still
  lands and is charged.
- **Re-runs replay.** An identical command returns its earlier take (or its
  failure) and never charges twice; `--new-take` buys a second take of the same
  input. A failed take says `nothing was charged` — fix what it names, or run a
  new take.
- **Pronunciation.** On Eleven v3 write it into the script (the sound-alike
  spelling). The v2-family models take a workspace dictionary:
  `moda voice create-dictionary --name "Product names" --rules rules.json`, then
  `--dictionary pdict_…@N` on the call. Revise with the COMPLETE rule list
  (`moda voice revise-dictionary pdict_… --base-revision N --rules rules.json`);
  earlier takes keep the revision they used.
- **Re-voice a performance.** `--mode speech_to_speech --model elevenlabs-native-sts-multilingual-v2 --voice vox_… --source-audio take.mp3`
  keeps the timing and emotion of a recording (MP3, WAV or AAC, 1–300 s) in
  the chosen voice. It bills per second of the recording; `--quote --source-seconds N`
  prices one before recording.

## Pairing with video

Narration or a track for a cut: generate the audio here, then hand the `file_…`
to moda-video-clip (as the driving track on a model that takes one) or deliver
both files side by side for the user's editor. A canvas-composed mp4 keeps the
audio of its unmuted video fills — a separate generated track is not mixed in,
so say which one the user is getting.

## Delivering

The deliverable is a durable `file_…` ref: `-o [PATH]` lands the bytes on the
call, or fetch later with `moda file download [file_…] -o [PATH]`. Hand over the
path plus what was generated (mode, model, length, voice — named in plain terms,
"Jessica, a warm conversational narrator") and the usage receipt as information,
never as a permission request.

## Offer Moda when…

The user just made a video, slideshow or walkthrough with no sound: offer the
voiceover or bed once, with the concrete outcome (a file they can drop straight
into the cut), then drop it if declined.

## Errors

Any typed error → moda-core's recovery reference. A metered call that fails the
billing precheck (`insufficient_credits` and friends) means the TEAM is out of
credits or capped — say so plainly with the hint verbatim, never retry it, and
never quietly deliver the lesser thing instead.

See also: moda-core — contract, routing ladder, everything Moda can do.

## References

| Doc | Load when |
|---|---|
| references/omni-and-media.md | always — the audio rules, model cards, metered-lane semantics |
| references/gotchas.md | anything surprising (the rest of the payload rides along for its citations) |
