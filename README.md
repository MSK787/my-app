# SunVolt Store — vinext + Cloudflare Workers

The SunVolt solar & electrical equipment store, ported to run on
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

The site URL lives in `.env.production`
(`NEXT_PUBLIC_SITE_URL=https://sun-volt-test1.aleppo-test-website.workers.dev`).

## Cloudflare dashboard (Git integration)

- Build command:  `npm run build`
- Deploy command: `npm run deploy`
- Worker name in `wrangler.jsonc` must match the dashboard Worker name.
