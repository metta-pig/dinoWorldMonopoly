Place **per-game** materials here while running `@game-build`. One dedicated repo per game (see root `README.md`). This folder is **gitignored except this README**.

| File | Purpose |
|------|---------|
| `brief.md` | Theme, player count, duration, complexity, win condition ideas, content warnings |
| `game-type.txt` | One line: preset id from `src/lib/gameTypePresets.ts` |
| `deliverable.txt` | One line: `rules-only`, `print-and-play`, or `digital-web` |
| `audience.txt` | One line: `hobby`, `pitch`, `classroom`, `internal` |
| `art-direction.txt` | Optional: `minimal`, `flat-vector`, `pixel`, `sketch` |
| `references/` | Optional images, links to games you want to emulate |

Example `brief.md` opener:

```markdown
# Ocean rescue card party

- Players: 4–8, 20 minutes
- Tone: family-friendly, cooperative scoring optional
- Generate card art: yes, flat-vector, marine animals
- Deliverable: print-and-play + rules (no digital for now)
```
