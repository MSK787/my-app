# Aleppo Power — Solar & Electrical Store (vinext + Cloudflare Workers)

The Aleppo Power solar & electrical equipment store, running on
Cloudflare's vinext (Next.js App Router on Vite + Workers).

## Local development

```bash
npm install
npm run dev      # vinext dev server
```

## Build & deploy to Cloudflare

```bash
npm run build    # vinext build → dist/
npm run deploy   # vinext-cloudflare deploy (needs: npx wrangler login)
```

The site URL lives in `.env.production`:
`NEXT_PUBLIC_SITE_URL=https://sun-volt-test1.aleppo-test-website.workers.dev`

## Cloudflare dashboard (Git integration)

- Build command:  `npm run build`
- Deploy command: `npm run deploy`
- The Worker `name` in `wrangler.jsonc` must match the dashboard Worker name.

## Branding

- Logo: `public/images/logo.png` (header/footer badge) and
  `public/images/logo-full.png` (the full lockup).
- Favicon: `app/icon.svg` (navy tile with the logo).
- Brand colors from the logo: navy `#20336d`, orange `#f05b21`.
