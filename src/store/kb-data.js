// Knowledge Base content — Topic > Section > Post
// Ported from hovers-os/src/lib/kb-data.ts

export const KB_TOPICS = [
  {
    id: 'onboarding',
    name: 'Onboarding',
    color: '#6366f1',
    sections: [
      {
        id: 'account-masterplan',
        title: 'Account Masterplan',
        posts: [
          {
            id: 'p1', title: 'Masterplan Content',
            tags: ['onboarding', 'masterplan'],
            updatedAt: '2026-04-10', createdBy: 'Swarup Mane',
            content: `# Masterplan Content Guide

## What is a Masterplan?

The Masterplan is the **first deliverable** after a client is onboarded. It's a comprehensive strategy document that covers:

1. **Brand Research** — Who they are, what they sell, their market position
2. **Audience Research** — Who buys, why, pain points, language
3. **Competitor Research** — What competitors are doing in paid + organic
4. **Content Strategy** — What content to create, what angles to use
5. **Media Plan** — Budget allocation, platform split, funnel strategy

## Structure

Every masterplan follows this format:

- Executive Summary (1 page)
- Brand Overview
- Market Analysis
- Audience Personas (2-3)
- Competitor Landscape
- Channel Strategy (Meta + Google + others)
- Creative Strategy
- Budget Allocation
- KPI Targets
- 90-Day Roadmap

## Timeline

- **Week 1**: Research phase (brand + audience + competitor)
- **Week 2**: Strategy development
- **Week 3**: Document creation + internal review
- **Week 4**: Client presentation

> The masterplan should be so thorough that anyone picking up the account can understand the strategy completely.`
          },
        ]
      },
      {
        id: 'onboarding-checklist',
        title: 'Onboarding - Checklist - Technical',
        posts: [
          {
            id: 'p2', title: 'Technical Checklist',
            tags: ['onboarding', 'checklist', 'technical'],
            updatedAt: '2026-04-08', createdBy: 'Himansh Gawade',
            content: `# Technical Onboarding Checklist

## Access Setup

- [ ] Meta Business Manager — Admin access
- [ ] Google Ads — MCC level access
- [ ] Google Analytics 4 — Editor access
- [ ] Google Tag Manager — Publish access
- [ ] Shopify / Website — Staff access
- [ ] Google Search Console — Owner access

## Tracking Verification

- [ ] Meta Pixel firing on all pages
- [ ] CAPI (Conversions API) set up and sending events
- [ ] Standard events: ViewContent, AddToCart, InitiateCheckout, Purchase
- [ ] Custom events if needed (Lead, CompleteRegistration)
- [ ] Google Ads conversion tracking — all conversions verified
- [ ] GA4 events — purchase, add_to_cart, begin_checkout
- [ ] UTM parameters configured for all campaigns

## Verification Tests

- [ ] Place a test order and verify it shows in:
  - Meta Events Manager
  - Google Ads conversions
  - GA4 real-time
- [ ] Check for duplicate events
- [ ] Verify conversion values match actual order values
- [ ] Cross-check GA4 vs platform numbers (acceptable variance: <10%)

## Common Issues

### Meta Pixel not firing
1. Check if pixel ID is correct in website settings
2. Check for adblockers during testing
3. Use Meta Pixel Helper Chrome extension
4. Check GTM triggers if using GTM

### CAPI events not matching
1. Verify server-side event setup
2. Check deduplication with event_id
3. Ensure fbclid is being passed

### Google Ads conversion discrepancy
1. Check conversion window settings
2. Verify attribution model (data-driven vs last-click)
3. Check for auto-tagging enabled

> Never launch paid campaigns without verified tracking. This is non-negotiable.`
          },
        ]
      },
      {
        id: 'new-employee',
        title: 'New Employee Onboarding',
        posts: [
          {
            id: 'p2a', title: 'Day 1 - First Week Guide',
            tags: ['onboarding', 'hr', 'new-employee'],
            updatedAt: '2026-03-15', createdBy: 'Swarup Mane',
            content: `# Your First Week at Hovers

## Day 1 — Setup & Orientation

- [ ] Laptop + accounts setup
- [ ] Meet your reporting manager
- [ ] Tour of Growth OS workspace
- [ ] Intro to your assigned accounts

## Day 2-3 — Learn the Tools

- [ ] Meta Ads Manager walkthrough
- [ ] Google Ads interface overview
- [ ] Shopify dashboard basics
- [ ] GA4 + tracking fundamentals

## Day 4-5 — Shadow & Practice

- [ ] Shadow your team lead on 2 client accounts
- [ ] Review live campaign structures
- [ ] Try creating a draft campaign (don't publish!)

> Your first week is about learning, not delivering. Take your time.`
          },
          {
            id: 'p2b', title: 'Tools & Access Guide',
            tags: ['onboarding', 'tools'],
            updatedAt: '2026-03-15', createdBy: 'Swarup Mane',
            content: `# Tools We Use

## Advertising Platforms
- **Meta Ads Manager** — Primary paid social
- **Google Ads** — Search, Shopping, Pmax, YouTube
- **Amazon Ads** — Sponsored Products, Brands, Display

## Analytics
- **Google Analytics 4** — Website analytics
- **Meta Pixel + CAPI** — Conversion tracking
- **Google Tag Manager** — Tag management

## Operations
- **Hovers OS** — Task management, accounts, KB
- **Slack** — Team communication
- **Google Workspace** — Email, Docs, Sheets`
          },
        ]
      }
    ],
  },
  {
    id: 'facebook-ads',
    name: 'Facebook Ads',
    color: '#3b82f6',
    sections: [
      {
        id: 'fb-fundamentals',
        title: 'Fundamentals',
        posts: [
          {
            id: 'p3', title: 'CPM - CPC and CTR Co-relation',
            tags: ['meta', 'metrics', 'fundamentals'],
            updatedAt: '2026-04-05', createdBy: 'Himansh Gawade',
            content: `# CPM, CPC, and CTR — How They Relate

## The Core Metrics

- **CPM** (Cost Per Mille) = Cost per 1000 impressions
- **CPC** (Cost Per Click) = Cost per link click
- **CTR** (Click-Through Rate) = Clicks / Impressions × 100

## The Relationship

\`CPC = CPM / (CTR × 10)\`

This means:
- **Higher CTR** → **Lower CPC** (even if CPM stays the same)
- **Lower CPM** → **Lower CPC** (even if CTR stays the same)
- You control CTR through **creative quality**
- You influence CPM through **audience targeting + bid strategy**

## Benchmarks by Category (India)

| Category | Avg CPM | Avg CTR | Avg CPC |
|----------|---------|---------|---------|
| Fashion | ₹80-150 | 1.5-2.5% | ₹4-8 |
| Skincare | ₹100-200 | 1.2-2.0% | ₹5-12 |
| FMCG | ₹60-120 | 1.0-1.8% | ₹4-10 |
| Electronics | ₹120-250 | 0.8-1.5% | ₹8-20 |
| D2C Avg | ₹80-180 | 1.2-2.2% | ₹4-12 |

## How to Improve

### Lower your CPM:
- Use broader audiences
- Avoid over-saturated interests
- Test different placements (Reels, Stories)
- Refresh creatives (reduces frequency)

### Increase your CTR:
- Better hooks (first 3 seconds of video / first visual of static)
- Stronger CTA
- Test UGC vs branded
- Use social proof in ad copy

> If your CPC is too high, don't just increase budget. Fix your creative first.`
          },
        ]
      },
      {
        id: 'testing-structure',
        title: 'Testing Structure',
        posts: [
          {
            id: 'p4', title: 'Creative Testing - Metrics',
            tags: ['meta', 'testing', 'creative'],
            updatedAt: '2026-04-01', createdBy: 'Swarup Mane',
            content: `# Creative Testing Metrics

## What to Measure

### Primary Metrics (decide winners)
- **Hook Rate** — 3-second video views / Impressions × 100 → Target: >25%
- **Hold Rate** — ThruPlays / 3-second views × 100 → Target: >15%
- **CTR (Link)** — Link clicks / Impressions × 100 → Target: >1.5%
- **CPA** — Cost per desired action → Must be below target

### Secondary Metrics (diagnose problems)
- **CPM** — Are you paying too much for reach?
- **Frequency** — Is audience seeing ad too many times?
- **Outbound CTR** — Are people actually leaving Facebook?
- **Landing Page View Rate** — LP views / Link clicks → Target: >70%

## Testing Framework

### Phase 1: Concept Test (3-5 days)
- Test 3-5 different concepts
- Same audience, different ads
- Budget: ₹500-1000/day per ad set
- Winner = lowest CPA or highest ROAS

### Phase 2: Hook Test (3-5 days)
- Take winning concept
- Test 3-5 different hooks
- Same body, different openings

### Phase 3: Format Test (3-5 days)
- Take winning hook + concept
- Test: Video vs Static vs Carousel
- Test: UGC vs Branded vs Mixed

### Phase 4: Copy Test (3-5 days)
- Take winning creative
- Test: Short vs Long copy
- Test: Different CTAs
- Test: Emoji vs No emoji

## Kill Rules

Kill a creative if after 3 days:
- CTR < 0.8%
- Hook Rate < 15%
- CPA > 2x target
- No purchases/leads with ₹2000+ spend`
          },
        ]
      },
      {
        id: 'audience-creative',
        title: 'Audience + Creative',
        posts: [
          {
            id: 'p5', title: 'Audience + Creative Testing',
            tags: ['meta', 'audience', 'creative', 'testing'],
            updatedAt: '2026-03-28', createdBy: 'Akash Suresan',
            content: `# Audience + Creative Pairing

## The Rule

> Never test a new audience with old creative, and never test new creative with a cold audience.

## Pairing Matrix

| | Proven Creative | New Creative |
|---|---|---|
| **Proven Audience** | Scale ✅ | Creative Test 🧪 |
| **New Audience** | Audience Test 🎯 | Too many variables ❌ |

## Best Practices

### For Audience Testing
- Use your **top 3 proven creatives**
- Test one audience variable at a time
- Run for 5-7 days minimum
- Budget: ₹1000/day per ad set

### For Creative Testing
- Use your **best performing audience**
- Test 3-5 creatives per batch
- Run for 3-5 days minimum
- Budget: ₹500-1000/day per ad set

## Audience Types to Test

1. Broad (no targeting) — works best at scale
2. Interest stacks (3-5 related interests)
3. Lookalike 1% (purchase-based)
4. Lookalike 1-3% (ATC-based)
5. Custom audiences (website visitors, email lists)`
          },
        ]
      },
    ],
  },
  {
    id: 'programmatic-advertising',
    name: 'Programmatic Advertising',
    color: '#8b5cf6',
    sections: [
      {
        id: 'basics-programmatic',
        title: 'Basics of Programmatic',
        posts: [
          {
            id: 'p6', title: 'Basics of Programmatic',
            tags: ['programmatic', 'basics'],
            updatedAt: '2026-03-20', createdBy: 'Alan Roy Varghese',
            content: `# Basics of Programmatic Advertising

## What is Programmatic?

Programmatic advertising is the **automated buying and selling** of digital ad inventory using algorithms and data.

## Key Terms

- **DSP** — Demand-Side Platform (where advertisers buy)
- **SSP** — Supply-Side Platform (where publishers sell)
- **DMP** — Data Management Platform
- **RTB** — Real-Time Bidding
- **PMP** — Private Marketplace (invite-only deals)

## When to Use Programmatic

- Brand awareness campaigns at scale
- Retargeting across the open web
- OTT/CTV advertising
- When you need reach beyond Meta/Google

## Platforms We Use

- **DV360** (Google's DSP)
- **The Trade Desk**
- **Amazon DSP**

> Programmatic is for reach and awareness. Don't expect direct-response ROAS like Meta/Google.`
          },
          {
            id: 'p7', title: 'Steps of Programmatic',
            tags: ['programmatic', 'sop', 'setup'],
            updatedAt: '2026-03-20', createdBy: 'Alan Roy Varghese',
            content: `# Steps to Launch a Programmatic Campaign

## Step 1: Define Objectives
- Awareness (impressions, reach)
- Consideration (video views, site visits)
- Conversion (retargeting only)

## Step 2: Audience Setup
- First-party data (pixel, CRM)
- Third-party segments
- Contextual targeting
- Geo-targeting

## Step 3: Creative Assets
- Display: 300x250, 728x90, 160x600, 320x50 (responsive)
- Video: 15s + 30s versions, 16:9 ratio
- Native: Headline + description + image

## Step 4: Campaign Setup
- Set frequency caps (3-5 per user per day)
- Set viewability targets (>70%)
- Brand safety: block lists + verification
- Budget: daily pacing

## Step 5: Optimization
- Check daily for first week
- Optimize placements (remove low-viewability sites)
- Adjust bids based on performance
- Refresh creative every 2 weeks`
          },
        ]
      },
    ],
  },
  {
    id: 'facebook-campaign-types',
    name: 'Facebook Campaign Types',
    color: '#ec4899',
    sections: [
      {
        id: 'campaign-types',
        title: 'Campaign Formats',
        posts: [
          {
            id: 'p8', title: 'DCO - Dynamic Creative Optimisation',
            tags: ['meta', 'dco', 'campaign-type'],
            updatedAt: '2026-03-15', createdBy: 'Himansh Gawade',
            content: `# DCO — Dynamic Creative Optimization

## What is DCO?

Meta automatically combines different creative elements (images, videos, headlines, descriptions, CTAs) to find the best-performing combination for each user.

## When to Use

- You have multiple creative assets
- Want to quickly test combinations
- Running TOF prospecting
- Have at least ₹2000/day budget per ad set

## How to Set Up

1. Create campaign → Choose objective
2. At ad level → Enable "Dynamic Creative"
3. Upload: up to 10 images/videos
4. Write: up to 5 headlines, 5 primary texts, 5 descriptions
5. Select: multiple CTAs

## Best Practices

- Don't mix completely different products in one DCO
- Keep a theme — vary the angle, not the product
- Use 5 images + 3 headlines + 3 texts as sweet spot
- Let it run 5-7 days before judging

## Limitations

- Can't see exact combination performance easily
- Doesn't work well with very different creative styles
- Not recommended for retargeting (too broad)

> DCO is great for testing at scale, but once you find winners, move them to standard ads for more control.`
          },
          {
            id: 'p9', title: 'DPA - Catalog Ads (Campaign / Ad level)',
            tags: ['meta', 'dpa', 'catalog', 'ecommerce'],
            updatedAt: '2026-03-10', createdBy: 'Sumedh Lokhande',
            content: `# DPA — Dynamic Product Ads (Catalog Ads)

## What is DPA?

DPA automatically shows products from your catalog to people who have expressed interest — either on your website or on Facebook/Instagram.

## Types

### Retargeting DPA (BOF)
- Shows products people viewed/carted but didn't buy
- Highest ROAS campaign type
- Must-have for every e-commerce account

### Broad Audience DPA (TOF/MOF)
- Shows products to new users based on interest signals
- Works well with large catalogs (50+ products)
- Meta's algorithm picks products for each user

## Setup Requirements

1. Product catalog uploaded to Meta Commerce Manager
2. Pixel with ViewContent, AddToCart, Purchase events
3. Catalog connected to pixel for dynamic matching

## Best Practices

- Use **carousel format** for retargeting
- Add **overlay** (price, discount %, "bestseller")
- Separate campaigns for: viewed, carted, past purchasers
- Exclude purchasers (last 7-14 days) from retargeting

## Creative Tips

- Custom catalog frames with brand colors
- Add "Back in Stock" or "Limited" overlays
- Use lifestyle images instead of white background where possible

> Every D2C brand spending >₹1L/month MUST have a DPA retargeting campaign running.`
          },
        ]
      },
    ],
  },
  {
    id: 'google-ads',
    name: 'Google Ads',
    color: '#22c55e',
    sections: [
      {
        id: 'search-campaigns',
        title: 'Search Campaigns',
        posts: [
          {
            id: 'p10', title: 'Search Campaign Structure',
            tags: ['google', 'search', 'structure'],
            updatedAt: '2026-04-01', createdBy: 'Sumedh Lokhande',
            content: `# Google Search Campaign Structure

## Campaign Hierarchy

Brand Search > Non-Brand Search > Competitor Search > DSA

## Naming Convention

\`[Brand]_[Type]_[Match]_[Target]\`

Example: \`Sanfe_NB_Exact_FeminineHygiene\`

## Match Types

- **Exact [keyword]** — Highest intent, start here
- **Phrase "keyword"** — Medium intent
- **Broad keyword** — Use only with Smart Bidding + sufficient data

## Budget Split (Typical)

- Brand: 15-20%
- Non-Brand Exact: 40-50%
- Non-Brand Phrase: 20-25%
- DSA: 10-15%

> Always protect your brand terms. Competitors WILL bid on them.`
          },
        ]
      },
      {
        id: 'shopping-pmax',
        title: 'Shopping & Pmax',
        posts: [
          {
            id: 'p11', title: 'Performance Max Best Practices',
            tags: ['google', 'pmax', 'shopping'],
            updatedAt: '2026-03-25', createdBy: 'Sumedh Lokhande',
            content: `# Performance Max (Pmax) Best Practices

## What is Pmax?

Google's AI-driven campaign type that runs across ALL Google properties: Search, Shopping, Display, YouTube, Gmail, Discover, Maps.

## When to Use

- E-commerce with product feed
- Need cross-channel reach
- Have 30+ conversions/month in the account
- Want to scale beyond search

## Asset Group Structure

- 1 campaign per product category
- Separate asset groups for hero products vs catalog
- Include: 20 images, 5 videos, 5 headlines, 5 long headlines, 5 descriptions

## Signals (Audience Signals)

These are HINTS, not targeting:
- Custom segments (search terms, competitor URLs)
- Your data (purchasers, high-value customers)
- Interests & demographics

## Optimization

- Exclude brand terms (use a script)
- Check placement reports weekly
- Remove low-quality Display placements
- Set target ROAS after 2 weeks of data

> Pmax is powerful but a black box. Always run brand search separately.`
          },
        ]
      },
    ],
  },
  {
    id: 'sops',
    name: 'SOPs',
    color: '#f59e0b',
    sections: [
      {
        id: 'daily-ops',
        title: 'Daily Operations',
        posts: [
          {
            id: 'p12', title: 'Daily Reporting SOP',
            tags: ['sop', 'reporting', 'daily'],
            updatedAt: '2026-04-10', createdBy: 'Swarup Mane',
            content: `# Daily Reporting SOP

## When

Every working day by **11:00 AM**

## What to Report

For each active account:

- Spend (yesterday)
- Revenue (yesterday)
- ROAS
- Orders / Leads
- CPA / CPL
- Any anomalies or flags

## Escalation Rules

Raise a flag **immediately** if:
- Spend is >120% of daily budget
- ROAS drops below 1.5x (for D2C)
- CPA increases by >30% day-over-day
- Any campaign gets rejected
- Tracking seems broken (0 conversions with spend)

> Reporting is not optional. If you missed it, it didn't happen.`
          },
          {
            id: 'p13', title: 'Weekly Optimization Checklist',
            tags: ['sop', 'optimization', 'weekly'],
            updatedAt: '2026-04-05', createdBy: 'Himansh Gawade',
            content: `# Weekly Optimization Checklist

## Every Monday (Full Account Review)

- [ ] Review last 7 days performance vs targets
- [ ] Check budget pacing (on track for monthly target?)
- [ ] Review creative fatigue (frequency >2.5 = refresh)
- [ ] Check audience overlap between ad sets
- [ ] Review search term report (Google)
- [ ] Add negative keywords (Google)
- [ ] Check placement report (Pmax/Display)
- [ ] Update client on performance

## Creative Health

- [ ] How many active creatives per account?
- [ ] Any creative running >3 weeks? → Plan refresh
- [ ] New creative pipeline — is there enough for next week?

## Budget Adjustments

- Scale winners by max 20%/day
- Cut losers by max 30%/day
- Redistribute from low to high performers

## Client Communication

- [ ] Weekly update sent/scheduled
- [ ] Any pending client approvals?
- [ ] Any upcoming promotions to plan for?`
          },
        ]
      },
      {
        id: 'client-sops',
        title: 'Client Management',
        posts: [
          {
            id: 'p14', title: 'Client Communication Guidelines',
            tags: ['sop', 'client', 'communication'],
            updatedAt: '2026-03-20', createdBy: 'Shreya Shah',
            content: `# Client Communication Guidelines

## Response Time

- **Urgent issues** (tracking broken, overspend): Within 1 hour
- **Regular queries**: Within 4 hours
- **Reports/documents**: Within 24 hours

## Weekly Updates

Send every **Friday by 5 PM**:
- Week performance summary
- Key wins
- Challenges + action taken
- Plan for next week
- Any approvals needed

## Monthly Reviews

Schedule a **30-min call** every month:
- Monthly performance review
- ROAS/CPA trends
- Creative analysis
- Recommendations for next month
- Budget discussion

## What to NEVER Do

- Never share raw ad account access
- Never make budget changes without approval
- Never blame the platform for poor performance
- Never promise specific ROAS numbers

> The client should feel informed, not overwhelmed. Keep updates concise and action-oriented.`
          },
        ]
      },
    ],
  },
];

// Flatten all posts for search
export function getAllPosts() {
  return KB_TOPICS.flatMap(topic =>
    topic.sections.flatMap(section =>
      section.posts.map(post => ({
        ...post,
        topicName: topic.name,
        topicColor: topic.color,
        sectionTitle: section.title,
      }))
    )
  );
}

// Get all unique tags
export function getAllTags() {
  const tags = new Set();
  KB_TOPICS.forEach(t => t.sections.forEach(s => s.posts.forEach(p => p.tags.forEach(tag => tags.add(tag)))));
  return Array.from(tags).sort();
}
