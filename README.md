# Reasoning Compression OS (MVP)

A minimal Next.js app that turns long-form text into a structured reasoning brief: core problem, tensions, ambiguities, decisions (with reasoning), tradeoffs, and next moves.

## Product demo

The **Reasoning brief** view below uses the same UI as a live compression. In the running app, open **`/demo`** for this static sample (no API key).

![Reasoning brief — structured sections, calm typography, executive-memo layout](docs/readme-ui.png)

## Setup

```bash
npm install
cp .env.example .env.local
# add OPENAI_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Screenshots

To regenerate `docs/readme-ui.png` (full-page capture of `/demo`):

```bash
npm run capture:readme
```

Requires a one-time Playwright browser install: `npx playwright install chromium`.

## Deploy

Works on [Vercel](https://vercel.com): set `OPENAI_API_KEY` in project environment variables.

Decision history is stored in `localStorage` in this MVP (no database).

## Stack

Next.js (App Router), Tailwind CSS v4, OpenAI Chat Completions with JSON mode.
