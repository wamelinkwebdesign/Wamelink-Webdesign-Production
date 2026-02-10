# 🚀 Wamelink Sales Outreach Automation — Setup Guide

## Overview

This package adds 4 phases of sales automation to your Wamelink Webdesign app:

| Phase | Feature | Files |
|-------|---------|-------|
| 1 | **Send real emails** from the app via Resend | `api/send-email.ts`, updated `OutreachComposer.tsx` |
| 2 | **AI-powered messages** via Claude API | `api/generate-message.ts`, `api/analyze-website.ts` |
| 3 | **Bulk CSV import** for leads | `api/parse-csv.ts`, `components/sales/CSVImport.tsx` |
| 4 | **Automated follow-up sequences** | `api/cron/follow-ups.ts`, `api/schedule-followups.ts`, `components/sales/FollowUpSequence.tsx` |
| 5 | **Prospect Finder** — discover businesses with bad websites | `api/find-prospects.ts`, `api/score-websites.ts`, `components/sales/ProspectFinder.tsx` |

---

## Step 1: Install Dependencies

No new npm packages needed! All API calls use native `fetch()` — both Resend and Anthropic have REST APIs.

The only package you optionally need is for TypeScript types:

```bash
npm install --save-dev @vercel/node
```

---

## Step 2: Add Files to Your Repo

Copy these files into your `Wamelink-Webdesign-Production` repo:

```
├── api/                          ← NEW: Vercel serverless functions
│   ├── send-email.ts             ← Phase 1: Email sending
│   ├── generate-message.ts       ← Phase 2: AI message generation
│   ├── analyze-website.ts        ← Phase 2: Website analysis
│   ├── parse-csv.ts              ← Phase 3: CSV parsing
│   ├── find-prospects.ts         ← Phase 5: Google Places search
│   ├── score-websites.ts         ← Phase 5: Website quality scoring
│   ├── schedule-followups.ts     ← Phase 4: Schedule sequences
│   └── cron/
│       └── follow-ups.ts         ← Phase 4: Daily cron job
├── components/sales/
│   ├── OutreachComposer.tsx      ← REPLACE: Now sends real emails
│   ├── CSVImport.tsx             ← NEW: CSV import UI
│   ├── FollowUpSequence.tsx      ← NEW: Sequence scheduler UI
│   └── ProspectFinder.tsx        ← NEW: Discover prospects
├── services/
│   └── outreachService.ts        ← REPLACE: Calls real APIs now
└── vercel.json                   ← NEW or MERGE: Cron config
```

---

## Step 3: Set Up Environment Variables

Go to **Vercel Dashboard → wamelink-webdesign-production → Settings → Environment Variables** and add:

### Phase 1: Resend (Email)

| Variable | Value | How to get it |
|----------|-------|---------------|
| `RESEND_API_KEY` | `re_xxxxxxxxxx` | Sign up at [resend.com](https://resend.com), create API key |

**After creating your Resend account:**
1. Go to Resend Dashboard → Domains
2. Add `wamelinkwebdesign.nl`
3. Add the SPF, DKIM, and DMARC DNS records they provide to your domain registrar
4. Wait for verification (usually 5-10 minutes)

### Phase 2: Claude AI

| Variable | Value | How to get it |
|----------|-------|---------------|
| `ANTHROPIC_API_KEY` | `sk-ant-xxxxxxxxxx` | Get from [console.anthropic.com](https://console.anthropic.com) |

### Phase 4: Vercel KV (for follow-up storage)

| Variable | Value | How to get it |
|----------|-------|---------------|
| `KV_REST_API_URL` | `https://xxx.kv.vercel-storage.com` | Create KV store in Vercel Dashboard → Storage |
| `KV_REST_API_TOKEN` | `AXxxxxxx` | Auto-generated when you create the KV store |
| `CRON_SECRET` | Any random string | Generate with: `openssl rand -hex 16` |

### Phase 5: Google Places (Prospect Finder)

| Variable | Value | How to get it |
|----------|-------|---------------|
| `GOOGLE_PLACES_API_KEY` | `AIzaXXXXXX` | Google Cloud Console → APIs & Services → Credentials |

**To set up Google Places:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project (or use existing)
3. Enable **"Places API (New)"** in APIs & Services → Library
4. Create an API key in Credentials
5. Restrict the key to "Places API (New)" only for security

**Cost:** ~$0.032 per search (20 results). The PageSpeed Insights API used for website scoring is FREE.

**To create Vercel KV:**
1. Go to Vercel Dashboard → Storage → Create Database
2. Select "KV" (Redis)
3. Name it `wamelink-sales`
4. The environment variables are automatically connected

---

## Step 4: Update vercel.json

If you already have a `vercel.json`, merge the cron config:

```json
{
  "crons": [
    {
      "path": "/api/cron/follow-ups",
      "schedule": "0 8 * * *"
    }
  ]
}
```

This runs the follow-up cron every day at 8:00 AM UTC (9:00 AM CET).

> **Note:** Vercel Cron is available on Pro plans. On Hobby, you can trigger it manually via: `curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://wamelinkwebdesign.nl/api/cron/follow-ups`

---

## Step 5: Wire Up New Components in SalesOutreach.tsx

Add the CSV Import and Follow-up Sequence buttons. In your `SalesOutreach.tsx`, add these imports:

```tsx
import CSVImport from './CSVImport';
import FollowUpSequence from './FollowUpSequence';
import ProspectFinder from './ProspectFinder';
```

Add state variables:

```tsx
const [showCSVImport, setShowCSVImport] = useState(false);
const [showProspectFinder, setShowProspectFinder] = useState(false);
const [sequenceLead, setSequenceLead] = useState<Lead | null>(null);
```

Add an import handler:

```tsx
const handleCSVImport = (importedLeads: Lead[]) => {
  importedLeads.forEach((lead) => saveLead(lead));
  refreshLeads();
};
```

Add buttons in your UI (e.g. next to "Nieuwe Lead"):

```tsx
<button onClick={() => setShowProspectFinder(true)} className="...">
  🔍 Prospect Finder
</button>
<button onClick={() => setShowCSVImport(true)} className="...">
  CSV Import
</button>
```

Add modals at the bottom:

```tsx
<AnimatePresence>
  {showCSVImport && (
    <CSVImport onImport={handleCSVImport} onClose={() => setShowCSVImport(false)} />
  )}
</AnimatePresence>

<AnimatePresence>
  {showProspectFinder && (
    <ProspectFinder
      onAddLead={(lead) => { saveLead(lead); refreshLeads(); }}
      existingLeads={leads}
      onClose={() => setShowProspectFinder(false)}
    />
  )}
</AnimatePresence>

<AnimatePresence>
  {sequenceLead && (
    <FollowUpSequence
      lead={sequenceLead}
      onClose={() => setSequenceLead(null)}
      onScheduled={() => {}}
    />
  )}
</AnimatePresence>
```

Add a "Follow-up Sequence" button in the lead detail panel:

```tsx
<button onClick={() => setSequenceLead(selectedLead)} className="...">
  <Calendar size={14} /> Follow-up Sequence
</button>
```

---

## Step 6: Deploy

```bash
git add -A
git commit -m "feat: add sales outreach automation (email, AI, CSV import, follow-ups)"
git push
```

Vercel will automatically deploy with the new API routes.

---

## How It All Works

### Email Flow
1. User creates a lead → clicks "Outreach" → composes message
2. AI generates personalized Dutch message via Claude
3. User clicks "Verstuur E-mail" → email sent via Resend
4. Message tracked in lead history

### Follow-up Flow
1. User sets up a sequence (e.g. 3 emails over 12 days)
2. Sequence stored in Vercel KV with scheduled dates
3. Daily cron at 8 AM checks for pending follow-ups
4. Claude generates fresh follow-up message
5. Email auto-sent via Resend

### CSV Import Flow
1. User uploads CSV (Google Maps export, KvK list, or custom)
2. API auto-detects Dutch/English column headers
3. User previews & selects which leads to import
4. Leads added to the pipeline

### Prospect Finder Flow
1. User picks a city + industry (e.g. "aannemers in Breda")
2. Google Places API returns businesses in that area
3. Each website is automatically scored using Google PageSpeed Insights (FREE)
4. Businesses ranked by "prospect score" — worse website = better prospect
5. User clicks + to add top prospects directly to the lead pipeline
6. Website issues and opportunities are saved in lead notes for personalized outreach

---

## Costs

| Service | Free Tier | Estimated Monthly Cost |
|---------|-----------|----------------------|
| Resend | 100 emails/day | Free for light use, €20/mo for 50k |
| Claude API | Pay per use | ~€5-15/mo for 200-500 messages |
| Vercel KV | 30k requests/mo | Free tier sufficient |
| Vercel Cron | 1 cron on Hobby | Free (1 cron on Hobby, unlimited on Pro) |
| Google Places | $200 free credit/mo | ~€3/100 searches (free credit covers ~6,000) |
| PageSpeed API | Unlimited (free) | €0 |

**Total estimated: €5-40/month** depending on volume. Google's $200/month free credit means Prospect Finder is effectively free for normal use.
