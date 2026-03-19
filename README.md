# Secret Movie Night — Haven

A voting site for Haven residents to decide the genre of movie night. The winning genre stays secret until the night itself.

## Stack

- **Next.js 14** (App Router, Server Actions)
- **TypeScript** + **Tailwind CSS**
- **Vercel KV** (Redis) — real cross-device vote counting

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Vercel KV locally

You need a Vercel project linked and a KV database provisioned (see Deployment below), then pull the env vars:

```bash
npx vercel link
npx vercel env pull
```

This creates a `.env.local` file with your KV credentials. **Never commit this file.**

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. In the Vercel dashboard → **Storage** → **Create Database** → **KV** (free tier)
4. Click **Connect to Project** — Vercel auto-injects the env vars
5. Redeploy — the site is live

### Results page

The `/results` page is public and shows live vote counts with a 30-second auto-refresh.

---

## Vote deduplication

Votes are deduplicated via an `HttpOnly` cookie (`smn_voted`) set for 7 days. This is intentionally lightweight — appropriate for a resident/student project where casual fairness matters more than cryptographic guarantees.

---

## Adding or changing genres

Edit `lib/genres.ts`. The genre list is the single source of truth — both the vote page and results page derive from it automatically.
