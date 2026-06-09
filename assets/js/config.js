// ── config.js ─────────────────────────────────────────────────────────────────
window.HUB_CONFIG = {
  // ⚠️ After Vercel deploys, replace this URL with your real one
  API_BASE: "https://creator-hub-api-git-main-itsjessok-s-projects.vercel.app/api/notion",

  DB: {
    PRODUCTS:    "37af37fb-725c-8068-8b49-f398174ea524",
    TODOS:       "37af37fb-725c-8048-8646-d712b6578c11",
    HOOKS:       "37af37fb-725c-8043-bc8b-fd6a27e62f05",
    VIDEOS:      "PASTE_VIDEOS_DB_ID",
    COMMISSIONS: "PASTE_COMMISSIONS_DB_ID",
    SCRIPTS:     "PASTE_SCRIPTS_DB_ID",
  },

  COLORS: {
    products:    { bg: "#2D1B4E", accent: "#C9B8E8", label: "Products"    },
    hooks:       { bg: "#1A2D1B", accent: "#A8E8B8", label: "Hook Bank"   },
    scripts:     { bg: "#2D1A1A", accent: "#E8A8B8", label: "Scripts"     },
    research:    { bg: "#1A2430", accent: "#A8D4E8", label: "Research"    },
    videos:      { bg: "#2D2210", accent: "#E8C8A8", label: "Videos"      },
    commissions: { bg: "#0F2020", accent: "#A8E8D8", label: "Commissions" },
  },
};

// ── Notion API helpers ────────────────────────────────────────────────────────
window.Notion = {
  async query(dbId, filter = {}, sorts = []) {
    const url = `${HUB_CONFIG.API_BASE}?path=/databases/${dbId}/query`;
    const body = {};
    if (filter.filter) body.filter = filter.filter;
    if (sorts.length)  body.sorts  = sorts;
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error(`Notion query failed: ${r.status}`);
    return r.json();
  },

  async getPage(pageId) {
    const url = `${HUB_CONFIG.API_BASE}?path=/pages/${pageId}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`Notion getPage failed: ${r.status}`);
    return r.json();
  },

  async createPage(dbId, properties) {
    const url = `${HUB_CONFIG.API_BASE}?path=/pages`;
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parent: { database_id: dbId }, properties }),
    });
    if (!r.ok) throw new Error(`Notion createPage failed: ${r.status}`);
    return r.json();
  },

  async updatePage(pageId, properties) {
    const url = `${HUB_CONFIG.API_BASE}?path=/pages/${pageId}`;
    const r = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ properties }),
    });
    if (!r.ok) throw new Error(`Notion updatePage failed: ${r.status}`);
    return r.json();
  },

  text(prop) {
    if (!prop) return "";
    if (prop.type === "title")        return prop.title?.map(t => t.plain_text).join("") || "";
    if (prop.type === "rich_text")    return prop.rich_text?.map(t => t.plain_text).join("") || "";
    if (prop.type === "select")       return prop.select?.name || "";
    if (prop.type === "multi_select") return prop.multi_select?.map(s => s.name).join(", ") || "";
    if (prop.type === "number")       return prop.number ?? "";
    if (prop.type === "checkbox")     return prop.checkbox ?? false;
    if (prop.type === "url")          return prop.url || "";
    if (prop.type === "date")         return prop.date?.start || "";
    return "";
  },

  richText(content) {
    return [{ type: "text", text: { content: String(content) } }];
  },
};
