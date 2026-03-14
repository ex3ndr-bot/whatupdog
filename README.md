# What Up Dog

Static GitHub Pages app for an AI-powered co-founder matching concept. No backend, no server, no build step.

## Files

- `index.html`: landing page with hero, features, and CTA
- `create-profile.html`: founder profile form saved to `localStorage`
- `matches.html`: ranked demo matches using a client-side scoring algorithm
- `chat.html`: mock chat UI for any selected match via `?id=...`
- `style.css`: complete dark gradient theme, cards, forms, layout, animation, responsive rules
- `js/data.js`: eight demo founder profiles
- `js/app.js`: shared browser logic for profile storage, matching, and chat
- `.nojekyll`: GitHub Pages compatibility marker

## Run

Open `index.html` directly in a browser, or publish the repository with GitHub Pages.

## Notes

- Profile data is stored only in browser `localStorage`
- Match scores are computed entirely on the client
- Chat responses are mocked and persisted per match in `localStorage`
