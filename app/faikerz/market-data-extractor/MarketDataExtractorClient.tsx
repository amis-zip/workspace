"use client";

import { useMemo, useState } from "react";

type Market = "elevenst" | "naver" | "coupang";

type ProductRow = {
  title: string;
  url: string;
  price: string;
  image?: string;
  seller?: string;
  reason?: string;
};

type Result = {
  total: number;
  matched: ProductRow[];
  dropped: ProductRow[];
  storeName: string;
  sellers: Record<string, number>;
  warnings: string[];
};

const markets: Array<{ value: Market; label: string }> = [
  { value: "elevenst", label: "11st" },
  { value: "naver", label: "Naver" },
  { value: "coupang", label: "Coupang" },
];

function clean(value: string | null | undefined) {
  return (value || "").replace(/[\u200b\u200c\u200d\ufeff]/g, "").trim();
}

function splitKeywords(value: string) {
  return value
    .split(/[\n,]+/)
    .map((v) => clean(v).toLowerCase())
    .filter(Boolean);
}

function text(el: Element | null) {
  return clean(el?.textContent || "");
}

function attr(el: Element | null, name: string) {
  return clean(el?.getAttribute(name) || "");
}

function absoluteImage(src: string) {
  if (!src) return "";
  if (src.startsWith("//")) return `https:${src}`;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return "";
}

function parseElevenst(html: string): { rows: ProductRow[]; storeName: string; warnings: string[] } {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const items = Array.from(doc.querySelectorAll(".store_product_item"));
  const rows = items
    .map((item) => {
      const link = item.querySelector("a.store_product_link") || item.querySelector("a[href]");
      const rawUrl = attr(link, "href");
      const img = item.querySelector(".store_product_thumb") || item.querySelector("img");
      return {
        title: text(item.querySelector(".store_product_name")),
        url: rawUrl.split("?")[0],
        price: text(item.querySelector(".store_product_new_price")),
        image: absoluteImage(attr(img, "src") || attr(img, "data-src") || attr(img, "data-original")),
      };
    })
    .filter((row) => row.title || row.url);

  return {
    rows,
    storeName: text(doc.querySelector(".store_name")),
    warnings: items.length === 0 ? ["11st 상품 컨테이너를 찾지 못했습니다. 저장한 HTML이 스토어 검색결과 페이지인지 확인하세요."] : [],
  };
}

function extractNaverState(html: string): unknown | null {
  const idx = html.indexOf("__PRELOADED_STATE__");
  if (idx < 0) return null;
  const prefix = html.slice(idx, idx + 200).match(/__PRELOADED_STATE__\s*=\s*/);
  if (!prefix) return null;
  const start = idx + prefix[0].length;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < html.length; i += 1) {
    const ch = html[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === "\\") {
      escaped = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (ch === "{") depth += 1;
    if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        try {
          return JSON.parse(html.slice(start, i + 1).replace(/\bundefined\b/g, "null"));
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

function getPath(obj: any, path: string[]) {
  return path.reduce((acc, key) => (acc && typeof acc === "object" ? acc[key] : undefined), obj);
}

function domainSlug(html: string) {
  for (const domain of ["brand.naver.com", "smartstore.naver.com"]) {
    const matches = Array.from(html.matchAll(new RegExp(`${domain.replace(/\./g, "\\.")}/([\\w-]+)/products/\\d+`, "g")));
    if (matches[0]?.[1]) return { domain, slug: matches[0][1] };
  }
  for (const domain of ["brand.naver.com", "smartstore.naver.com"]) {
    const matches = Array.from(html.matchAll(new RegExp(`${domain.replace(/\./g, "\\.")}/([\\w-]+)`, "g")));
    if (matches[0]?.[1]) return { domain, slug: matches[0][1] };
  }
  return { domain: "", slug: "" };
}

function parseNaver(html: string, sellerOnly: string): { rows: ProductRow[]; storeName: string; warnings: string[]; sellers: Record<string, number> } {
  const state: any = extractNaverState(html);
  if (!state) return { rows: [], storeName: "", warnings: ["Naver __PRELOADED_STATE__ JSON을 찾지 못했습니다."], sellers: {} };

  let products: any[] = getPath(state, ["categoryProducts", "simpleProducts"]) || [];
  let source = "categoryProducts";
  if (!products.length) {
    products = getPath(state, ["widgetContents", "wholeProductWidget", "A", "data", "simpleProducts"]) || [];
    source = "wholeProductWidget";
  }

  const { domain, slug } = domainSlug(html);
  const sellers: Record<string, number> = {};
  const rows = products
    .map((p) => {
      const seller = clean(p?.channel?.channelName || "");
      if (seller) sellers[seller] = (sellers[seller] || 0) + 1;
      const no = clean(String(p?.productNo || ""));
      return {
        title: clean(p?.name || p?.dispName || ""),
        url: domain && slug && no ? `https://${domain}/${slug}/products/${no}` : "",
        price: clean(String(p?.salePrice || "")),
        image: clean(p?.representativeImageUrl || ""),
        seller,
      };
    })
    .filter((row) => row.title && (!sellerOnly || row.seller === sellerOnly));

  const warnings: string[] = [];
  if (!products.length) warnings.push("Naver 상품 배열을 찾지 못했습니다.");
  if (!domain || !slug) warnings.push("Naver 상품 URL용 도메인/스토어 슬러그를 찾지 못했습니다.");
  if (Object.keys(sellers).length > 1) warnings.push("여러 셀러가 감지되었습니다. 필요한 경우 셀러 필터를 사용하세요.");
  warnings.push(`Naver source: ${source}`);

  return { rows, storeName: rows[0]?.seller || "", warnings, sellers };
}

function parseCoupang(html: string): { rows: ProductRow[]; storeName: string; warnings: string[] } {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const items = Array.from(doc.querySelectorAll('li[class*="ProductUnit_productUnit"]'));
  const seen = new Set<string>();
  const rows: ProductRow[] = [];
  items.forEach((item) => {
    const link = item.querySelector('a[href*="/vp/products/"]');
    const href = attr(link, "href");
    const id = href.match(/\/vp\/products\/(\d+)/)?.[1] || "";
    if (!id || seen.has(id)) return;
    seen.add(id);
    const imageWrap = item.querySelector('[class*="ProductUnit_productImage"]');
    const img = imageWrap?.querySelector("img") || null;
    rows.push({
      title: text(item.querySelector('[class*="ProductUnit_productName"]')),
      url: `https://www.coupang.com/vp/products/${id}`,
      price: text(item.querySelector('[class*="Price_priceValue"]')),
      image: absoluteImage(attr(img, "src") || attr(img, "data-src")),
    });
  });
  const brand = decodeURIComponent(html.match(/brandName=([^"&]+)/)?.[1] || "");
  const warnings = items.length !== rows.length ? [`중복 상품 ${items.length - rows.length}개를 productId 기준으로 제거했습니다.`] : [];
  if (items.length === 0) warnings.push("Coupang 상품 컨테이너를 찾지 못했습니다. 쿠팡 페이지 구조가 바뀌었을 수 있습니다.");
  return { rows, storeName: brand, warnings };
}

async function readHtml(file: File, market: Market) {
  const buffer = await file.arrayBuffer();
  const labels = market === "elevenst" ? ["euc-kr", "utf-8"] : ["utf-8", "euc-kr"];
  for (const label of labels) {
    try {
      return new TextDecoder(label).decode(buffer);
    } catch {
      // try next decoder
    }
  }
  return await file.text();
}

function filterRows(rows: ProductRow[], includeRaw: string, excludeRaw: string, mode: "any" | "all") {
  const include = splitKeywords(includeRaw);
  const exclude = splitKeywords(excludeRaw);
  const matched: ProductRow[] = [];
  const dropped: ProductRow[] = [];

  rows.forEach((row) => {
    const target = row.title.toLowerCase();
    const includeOk = include.length === 0 || (mode === "all" ? include.every((k) => target.includes(k)) : include.some((k) => target.includes(k)));
    const excludedBy = exclude.find((k) => target.includes(k));
    if (includeOk && !excludedBy) matched.push(row);
    else dropped.push({ ...row, reason: excludedBy ? `exclude: ${excludedBy}` : "include keyword mismatch" });
  });

  return { matched, dropped };
}

function escapeCell(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function downloadExcel(rows: ProductRow[], settings: { notifyDate: string; platform: string; mallName: string; limit: string }) {
  const limit = Number(settings.limit || 0);
  const selected = limit > 0 ? rows.slice(0, limit) : rows;
  const html = `<!doctype html><html><head><meta charset="utf-8"></head><body><table><thead><tr><th>고지일자</th><th>platform</th><th>mall_name</th><th>TITLE</th><th>URL</th></tr></thead><tbody>${selected
    .map(
      (row) =>
        `<tr><td>${escapeCell(settings.notifyDate)}</td><td>${escapeCell(settings.platform)}</td><td>${escapeCell(settings.mallName)}</td><td>${escapeCell(row.title)}</td><td>${escapeCell(row.url)}</td></tr>`,
    )
    .join("")}</tbody></table></body></html>`;
  const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `MarketData_${settings.platform || "output"}_${settings.notifyDate || "date"}.xls`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function MarketDataExtractorClient() {
  const [market, setMarket] = useState<Market>("elevenst");
  const [files, setFiles] = useState<File[]>([]);
  const [include, setInclude] = useState("");
  const [exclude, setExclude] = useState("");
  const [matchMode, setMatchMode] = useState<"any" | "all">("any");
  const [previewLimit, setPreviewLimit] = useState("50");
  const [sellerOnly, setSellerOnly] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [tab, setTab] = useState<"matched" | "dropped">("matched");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [notifyDate, setNotifyDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [platform, setPlatform] = useState("11st");
  const [mallName, setMallName] = useState("");
  const [limit, setLimit] = useState("");

  const visibleRows = useMemo(() => {
    const rows = tab === "matched" ? result?.matched || [] : result?.dropped || [];
    return rows.slice(0, Number(previewLimit || 50));
  }, [result, tab, previewLimit]);

  async function runPreview() {
    setError("");
    setLoading(true);
    try {
      let allRows: ProductRow[] = [];
      let storeName = "";
      let sellers: Record<string, number> = {};
      const warnings: string[] = [];

      for (const file of files) {
        const html = await readHtml(file, market);
        const parsed = market === "elevenst" ? parseElevenst(html) : market === "naver" ? parseNaver(html, sellerOnly) : parseCoupang(html);
        allRows = allRows.concat(parsed.rows);
        if (!storeName && parsed.storeName) storeName = parsed.storeName;
        Object.entries((parsed as any).sellers || {}).forEach(([seller, count]) => {
          sellers[seller] = (sellers[seller] || 0) + Number(count);
        });
        warnings.push(...parsed.warnings.map((w) => `${file.name}: ${w}`));
      }

      const filtered = filterRows(allRows, include, exclude, matchMode);
      setResult({ total: allRows.length, matched: filtered.matched, dropped: filtered.dropped, storeName, sellers, warnings });
      if (storeName && !mallName) setMallName(storeName);
      if (!platform) setPlatform(markets.find((m) => m.value === market)?.label || "");
      setTab("matched");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Preview failed.");
    } finally {
      setLoading(false);
    }
  }

  const sellerNames = Object.keys(result?.sellers || {});

  return (
    <section className="mt-8 space-y-5">
      <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6 md:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2 text-sm text-zinc-300">
            <span className="block text-xs uppercase tracking-[0.18em] text-zinc-500">Market</span>
            <select className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white" value={market} onChange={(e) => { const value = e.target.value as Market; setMarket(value); setPlatform(markets.find((m) => m.value === value)?.label || ""); }}>
              {markets.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </label>

          <label className="space-y-2 text-sm text-zinc-300">
            <span className="block text-xs uppercase tracking-[0.18em] text-zinc-500">HTML files</span>
            <input className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white" type="file" accept=".html,.htm" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} />
          </label>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="space-y-2 text-sm text-zinc-300">
            <span className="block text-xs uppercase tracking-[0.18em] text-zinc-500">Include keywords</span>
            <textarea className="min-h-24 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white" value={include} onChange={(e) => setInclude(e.target.value)} placeholder="골프" />
          </label>
          <label className="space-y-2 text-sm text-zinc-300">
            <span className="block text-xs uppercase tracking-[0.18em] text-zinc-500">Exclude keywords</span>
            <textarea className="min-h-24 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white" value={exclude} onChange={(e) => setExclude(e.target.value)} placeholder="중고, 리퍼" />
          </label>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <label className="space-y-2 text-sm text-zinc-300">
            <span className="block text-xs uppercase tracking-[0.18em] text-zinc-500">Match mode</span>
            <select className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white" value={matchMode} onChange={(e) => setMatchMode(e.target.value as "any" | "all")}>
              <option value="any">Any keyword</option>
              <option value="all">All keywords</option>
            </select>
          </label>
          <label className="space-y-2 text-sm text-zinc-300">
            <span className="block text-xs uppercase tracking-[0.18em] text-zinc-500">Preview limit</span>
            <input className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white" type="number" min="1" value={previewLimit} onChange={(e) => setPreviewLimit(e.target.value)} />
          </label>
          {sellerNames.length > 1 && (
            <label className="space-y-2 text-sm text-zinc-300">
              <span className="block text-xs uppercase tracking-[0.18em] text-zinc-500">Naver seller filter</span>
              <select className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white" value={sellerOnly} onChange={(e) => setSellerOnly(e.target.value)}>
                <option value="">All sellers</option>
                {sellerNames.map((seller) => <option key={seller} value={seller}>{seller} ({result?.sellers[seller]})</option>)}
              </select>
            </label>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" disabled={!files.length || loading} onClick={runPreview} className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40">
            {loading ? "Processing…" : "Preview"}
          </button>
          <a href="/faikerz" className="rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:border-white/30">Back to Tools</a>
        </div>
        {error && <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
      </div>

      {result && (
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6 md:p-8">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black p-4"><p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Extracted</p><p className="mt-2 text-3xl font-semibold">{result.total}</p></div>
            <div className="rounded-2xl border border-white/10 bg-black p-4"><p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Matched</p><p className="mt-2 text-3xl font-semibold">{result.matched.length}</p></div>
            <div className="rounded-2xl border border-white/10 bg-black p-4"><p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Dropped</p><p className="mt-2 text-3xl font-semibold">{result.dropped.length}</p></div>
          </div>

          {result.storeName && <p className="mt-4 text-sm text-zinc-400">Detected store: {result.storeName}</p>}
          {result.warnings.length > 0 && <div className="mt-4 space-y-2">{result.warnings.map((warning, i) => <p key={i} className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-3 text-sm text-yellow-100">{warning}</p>)}</div>}

          <div className="mt-6 flex gap-2">
            <button type="button" onClick={() => setTab("matched")} className={`rounded-full px-4 py-2 text-sm ${tab === "matched" ? "bg-white text-black" : "border border-white/10 text-zinc-300"}`}>Matched preview</button>
            <button type="button" onClick={() => setTab("dropped")} className={`rounded-full px-4 py-2 text-sm ${tab === "dropped" ? "bg-white text-black" : "border border-white/10 text-zinc-300"}`}>Dropped preview</button>
          </div>

          <div className="mt-4 max-h-[420px] overflow-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="sticky top-0 bg-black text-xs uppercase tracking-[0.14em] text-zinc-500"><tr><th className="p-3">#</th><th className="p-3">Image</th><th className="p-3">Title</th><th className="p-3">Price</th><th className="p-3">Reason / URL</th></tr></thead>
              <tbody>
                {visibleRows.map((row, i) => <tr key={`${row.url}-${i}`} className="border-t border-white/10"><td className="p-3 text-zinc-500">{i + 1}</td><td className="p-3">{row.image ? <img src={row.image} alt="" className="h-12 w-12 rounded-lg object-cover" /> : <span className="text-zinc-600">—</span>}</td><td className="p-3 text-zinc-100">{row.title}</td><td className="p-3 text-zinc-300">{row.price}</td><td className="p-3"><p className="text-zinc-500">{row.reason || row.seller || ""}</p>{row.url && <a href={row.url} target="_blank" rel="noreferrer" className="text-zinc-300 underline underline-offset-4">Open</a>}</td></tr>)}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <label className="space-y-2 text-sm text-zinc-300"><span className="block text-xs uppercase tracking-[0.18em] text-zinc-500">Notice date</span><input className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white" type="date" value={notifyDate} onChange={(e) => setNotifyDate(e.target.value)} /></label>
            <label className="space-y-2 text-sm text-zinc-300"><span className="block text-xs uppercase tracking-[0.18em] text-zinc-500">Platform</span><input className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white" value={platform} onChange={(e) => setPlatform(e.target.value)} /></label>
            <label className="space-y-2 text-sm text-zinc-300"><span className="block text-xs uppercase tracking-[0.18em] text-zinc-500">Mall name</span><input className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white" value={mallName} onChange={(e) => setMallName(e.target.value)} /></label>
            <label className="space-y-2 text-sm text-zinc-300"><span className="block text-xs uppercase tracking-[0.18em] text-zinc-500">Top N</span><input className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white" type="number" min="1" placeholder="All" value={limit} onChange={(e) => setLimit(e.target.value)} /></label>
          </div>

          <button type="button" onClick={() => downloadExcel(result.matched, { notifyDate, platform, mallName, limit })} className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200">
            Generate Excel
          </button>
        </div>
      )}
    </section>
  );
}
