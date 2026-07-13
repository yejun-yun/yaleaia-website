# yaleaia.org

The website of Yale AI Alignment (YAIA), a student community focused on
reducing catastrophic risks from advanced AI.

This is a fully static site: a Create React App frontend with no backend,
no authentication, and no server-side state. Everything it needs ships in
the build.

## Structure

```
yaleaia-website/
└── frontend/
    ├── public/
    │   ├── curriculum.md   # fellowship curriculum, rendered at /curriculum
    │   └── ...             # static assets, favicon, CNAME
    └── src/
        ├── pages/          # one component per route + Navbar/Footer
        ├── components/     # hero canvases, wave rules, logo morph, pathway
        ├── styles/         # one stylesheet per page/feature
        └── assets/         # logo SVGs and the wordmark Lottie
```

## Routes

- `/` — home: interactive thread-field hero, mission scroller, CAIS quote
- `/involve` — programs: contour-field hero, program pathway, fellowship,
  FAQ
- `/curriculum` — the fellowship curriculum, parsed and rendered from
  `public/curriculum.md`
- `/about` — about page

## Development

```
cd frontend
npm install
npm start        # dev server on localhost:3000
npm run build    # production build in frontend/build
```

## Updating the curriculum

Replace `frontend/public/curriculum.md` with the new export and redeploy.
The `/curriculum` page parses it at runtime: weeks are detected from
`**Week N: Title**` lines, and Overview / Learning Objectives / Core /
Recommended / Supplementary sections within each week. Placeholder
`- TBD` bullets are filtered out automatically. If a future export
renames section headers, adjust `SECTION_KEYS` in
`src/pages/Curriculum.js`.

## Deployment

See `deploy.md`. The site is served at [yaleaia.org](https://yaleaia.org)
(the CNAME file lives in `frontend/public/`).
