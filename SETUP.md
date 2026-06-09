# Jess's Creator Hub — Setup Guide

## What you're deploying

```
GitHub Pages  ←  hosts index.html + pages/*.html (free, static)
      ↓
Vercel API    ←  tiny proxy that hides your Notion secret key (free)
      ↓
Notion        ←  your real database (free tier works)
```

---

## Step 1 — Set up Notion databases

Create these databases in Notion. Copy each database ID from its URL
(the long string between the last `/` and `?v=`):

### Products database
Properties needed:
| Name | Type |
|------|------|
| Name | Title |
| Brand | Text |
| Tier | Select (hero / test / rotate / paused) |
| Account | Text |
| Commission_Rate | Text |
| GMV_30d | Number |
| Tags | Text (comma-separated) |
| Claim_Angle | Text |
| TikTok_URL | URL |

### Todos database
| Name | Type |
|------|------|
| Task | Title |
| Done | Checkbox |
| Priority | Select (high / med / low) |
| Date | Date |

### Hooks database
| Name | Type |
|------|------|
| Hook_Text | Title |
| Hook_Type | Select (Pain Point / Curiosity Gap / FOMO / Authority / Social Proof) |
| Product | Text |
| Account | Text |

### Scripts database (optional — for saving generated scripts)
| Name | Type |
|------|------|
| Product | Title |
| Script_Text | Text |
| Hook_Style | Text |
| Created | Date |

### Videos database
| Name | Type |
|------|------|
| Title | Title |
| Product | Text |
| Account | Select |
| Posted_Date | Date |
| Views | Number |
| GMV | Number |
| Completion_Rate | Number |
| Watch_Time_Avg | Number |

### Commissions database
| Name | Type |
|------|------|
| Month | Title |
| GMV_Total | Number |
| Commission_Total | Number |
| Top_Product | Text |
| Account | Select |

---

## Step 2 — Get your Notion API key

1. Go to https://www.notion.so/my-integrations
2. Click "New integration"
3. Name it "Creator Hub"
4. Copy the **Internal Integration Secret** (starts with `secret_`)
5. Go to each database → click "..." → "Add connections" → select your integration

---

## Step 3 — Deploy the Vercel API

1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New Project" → "Import Git Repository"
3. Push the `vercel-api/` folder to a GitHub repo first:
   ```bash
   cd vercel-api
   git init
   git add .
   git commit -m "Creator Hub API"
   gh repo create creator-hub-api --public --push --source=.
   ```
4. Import that repo on Vercel
5. In Vercel project settings → **Environment Variables**, add:
   - Key: `NOTION_SECRET`
   - Value: `secret_yourNotionKeyHere`
6. Deploy — Vercel gives you a URL like `https://creator-hub-api.vercel.app`

---

## Step 4 — Update config.js

Open `assets/js/config.js` and fill in:

```javascript
API_BASE: "https://creator-hub-api.vercel.app/api/notion",

DB: {
  PRODUCTS:    "your-products-db-id",
  TODOS:       "your-todos-db-id",
  HOOKS:       "your-hooks-db-id",
  VIDEOS:      "your-videos-db-id",
  COMMISSIONS: "your-commissions-db-id",
  SCRIPTS:     "your-scripts-db-id",
},
```

---

## Step 5 — Deploy to GitHub Pages

1. Create a GitHub repo (e.g. `creator-hub`)
2. Push the entire `creator-hub/` folder (everything except `vercel-api/`)
3. In repo Settings → Pages → Source: **Deploy from a branch** → `main` → `/` (root)
4. Your site is live at `https://yourusername.github.io/creator-hub/`

---

## Step 6 — Lock down CORS (important!)

Once you have your GitHub Pages URL, update `vercel-api/api/notion.js`:

```javascript
// Change this line:
res.setHeader("Access-Control-Allow-Origin", "*");

// To this:
res.setHeader("Access-Control-Allow-Origin", "https://yourusername.github.io");
```

Then redeploy Vercel. This prevents anyone else from using your API.

---

## Pages included

| Page | File | Color |
|------|------|-------|
| Dashboard | index.html | Plum |
| Products | pages/products.html | Lavender |
| Hook Bank | pages/hooks.html | Mint |
| Script Generator | pages/scripts.html | Blush |
| Product Research | pages/research.html | Sky blue |
| Videos | pages/videos.html | Gold |
| Commissions | pages/commissions.html | Teal |

---

## What works without Notion (demo mode)

Even before you connect Notion, the site runs on sample data:
- Dashboard shows your real stats (edit them in index.html for now)
- Products page shows your hero products
- Script Generator works fully (uses Claude API directly in the browser)
- To-dos work via localStorage (persist through browser sessions)
- Hook bank shows sample hooks

The yellow banner at the top disappears once you update config.js.
