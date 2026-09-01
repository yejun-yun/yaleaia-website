# Deployment Guide for yaleaia.org

The site is fully static — deploying means building `frontend/` and
serving the `build/` directory. No environment variables, no API keys,
no backend.

## Vercel (current host)

The GitHub repository is connected to a Vercel project (framework
preset `Create React App`, root directory `frontend`). Nothing is
deployed by hand:

- every push to any branch builds a *Preview* deployment (its URL is on
  the commit's GitHub deployment status; previews sit behind Vercel's
  deployment protection, so they need a Vercel login to view);
- merging into `main` builds *Production*, which is what yaleaia.org
  serves. Production is usually live within a minute of the merge.

So "deploy" means: open a PR against `main` and merge it.

Vercel's CRA preset serves `index.html` for any unknown path, which is
what path routing needs. `public/_redirects` is ignored by Vercel; it is
kept for hosts that read it (Cloudflare Pages, Netlify).

## Alternatives

Any static host works the same way (Render Static Site, Vercel, GitHub
Pages, Netlify): root directory `frontend`, build command
`npm run build`, publish directory `build`.

## Domain

DNS for yaleaia.org points at Vercel; the apex redirects to
`www.yaleaia.org`, so links in emails and posters should use the `www`
host directly.

`frontend/public/CNAME` (containing `yaleaia.org`) is included in the
build for hosts that use it, such as GitHub Pages.

## After deploying

1. Visit `https://yaleaia.org` and click through `/`, `/involve`,
   `/curriculum`. The app uses path routing, so the host must serve
   `index.html` for unknown paths (Vercel does this by default for CRA).
   Old `/#/involve`-style links are rewritten client-side.
2. Confirm `/curriculum` renders — it fetches `curriculum.md` from the
   site root at runtime
