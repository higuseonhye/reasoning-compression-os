# Reasoning Compression OS (MVP)

A minimal Next.js app that turns long-form text into a structured reasoning brief: core problem, tensions, ambiguities, decisions (with reasoning), tradeoffs, and next moves.

## Setup

```bash
npm install
cp .env.example .env.local
# add OPENAI_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Works on [Vercel](https://vercel.com): set `OPENAI_API_KEY` in project environment variables.

Decision history is stored in `localStorage` in this MVP (no database).

## Stack

Next.js (App Router), Tailwind CSS v4, OpenAI Chat Completions with JSON mode.
