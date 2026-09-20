---
id: 7
title: Take the typed sessions out of the data and the docs
type: chore
status: backlog
milestone: platform
created: 2026-09-20
updated: 2026-09-20
priority: p1
effort: m
section: site
---

The other half of 0006. Once nothing renders a session, the material it was
made of is dead weight, and leaving it in `tools.ts` invites the next person
to keep writing demos nobody will see.

    src/lib/data/tools.ts              `demo: Step[]` off the Tool type, and
                                       out of all 24 entries — roughly half the
                                       660 lines in the file
    src/lib/data/captures/             polkadot's doctor output; its only reader
                                       is the session. Keep the file if
                                       polkadot's story can type the real thing
                                       instead (0030), otherwise it goes
    src/lib/data/screens.test.ts       the demo-command checks
    README.md                          "The three views", and the Keys section
    docs/recordings.md                 the fan-out table's last row still offers
                                       "story first, or keep the typed session"

## Acceptance criteria

- [ ] `Step` is gone from the codebase, or kept only where a story uses it
- [ ] The README describes two views and the keys that drive them
- [ ] `npm run verify` passes
