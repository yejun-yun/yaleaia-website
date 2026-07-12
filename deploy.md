# Deployment Guide for yaleaia.org

The site is fully static — deploying means building `frontend/` and
serving the `build/` directory. No environment variables, no API keys,
no backend.

## Cloudflare Pages (recommended)

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Pages → Create a project → connect the GitHub repository
3. Build settings:
   - Framework preset: `Create React App`
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Build output directory: `build`
4. Deploy

## Alternatives

Any static host works the same way (Render Static Site, Vercel, GitHub
Pages, Netlify): root directory `frontend`, build command
`npm run build`, publish directory `build`.

## Domain

In Cloudflare DNS, point the apex at the host:

- Type: `CNAME`
- Name: `@`
- Target: your Pages URL (e.g. `your-project.pages.dev`)

`frontend/public/CNAME` (containing `yaleaia.org`) is included in the
build for hosts that use it, such as GitHub Pages.

## After deploying

1. Visit `https://yaleaia.org` and click through `/`, `/#/involve`,
   `/#/curriculum` (the app uses hash routing, so deep links work on any
   static host without rewrite rules)
2. Confirm `/curriculum` renders — it fetches `curriculum.md` from the
   site root at runtime
