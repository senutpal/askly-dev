import { parseHTML } from "linkedom";
import axios from "axios";
import CryptoJS from "crypto-js";
import robotsParser from "robots-parser";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_PROTOCOLS = ["http:", "https:"];
const CRAWL_TIMEOUT = 30000;
const REQUEST_DELAY = 500;
const MAX_RESOURCES_PER_JOB = 100;

export type CrawlOptions = {
  url: string;
  maxDepth: number;
  includeImages: boolean;
  includePdfs: boolean;
  includeText: boolean;
};

export type CrawledResource = {
  url: string;
  type: "text" | "image" | "pdf";
  title: string;
  description?: string;
  size?: number;
  sourceUrl: string;
  contentHash: string;
};

export type CrawlResult = {
  resources: CrawledResource[];
  pagesVisited: number;
  error?: string;
};

export async function crawlWebsite(
  options: CrawlOptions
): Promise<CrawlResult> {
  const { url, maxDepth, includeImages, includePdfs, includeText } = options;

  let baseUrl: URL;
  try {
    baseUrl = new URL(url);
    if (!ALLOWED_PROTOCOLS.includes(baseUrl.protocol)) {
      throw new Error("Only HTTP and HTTPS allowed");
    }
  } catch {
    throw new Error("Invalid URL");
  }

  const canCrawl = await checkRobotsTxt(baseUrl.origin);
  if (!canCrawl) throw new Error("Disallowed by robots.txt");

  const resources: CrawledResource[] = [];
  const visitedUrls = new Set<string>();
  const urlsToVisit: { url: string; depth: number }[] = [
    { url: baseUrl.href, depth: 0 },
  ];

  while (urlsToVisit.length && resources.length < MAX_RESOURCES_PER_JOB) {
    const current = urlsToVisit.shift();
    if (!current || current.depth > maxDepth) continue;

    const normalized = normalizeUrl(current.url);
    if (visitedUrls.has(normalized)) continue;
    visitedUrls.add(normalized);

    if (visitedUrls.size > 1) await delay(REQUEST_DELAY);

    let response;
    try {
      response = await axios.get(current.url, {
        timeout: CRAWL_TIMEOUT,
        responseType: "arraybuffer",
        maxContentLength: MAX_FILE_SIZE,
        headers: { "User-Agent": "AsklyBot/1.0" },
      });
    } catch {
      continue;
    }

    const contentType = response.headers["content-type"] || "";
    const data = new Uint8Array(response.data);
    const size = data.byteLength;

    if (contentType.includes("text/html")) {
      const html = new TextDecoder().decode(data);
      const pageResources = await extractResourcesFromHtml(html, current.url, {
        includeImages,
        includePdfs,
        includeText,
        baseUrl: baseUrl.origin,
      });
      resources.push(...pageResources);

      if (current.depth < maxDepth) {
        for (const link of extractLinks(html, current.url, baseUrl.origin)) {
          if (!visitedUrls.has(normalizeUrl(link))) {
            urlsToVisit.push({ url: link, depth: current.depth + 1 });
          }
        }
      }
    } else if (contentType.includes("application/pdf") && includePdfs) {
      const hash = hashString(current.url);
      resources.push({
        url: current.url,
        type: "pdf",
        title: getFilenameFromUrl(current.url),
        contentHash: hash,
        sourceUrl: current.url,
        size,
      });
    } else if (contentType.startsWith("image/") && includeImages) {
      const hash = hashString(current.url);
      resources.push({
        url: current.url,
        type: "image",
        title: getFilenameFromUrl(current.url),
        contentHash: hash,
        sourceUrl: current.url,
        size,
      });
    }
  }

  return {
    resources: deduplicateResources(resources),
    pagesVisited: visitedUrls.size,
  };
}

async function checkRobotsTxt(url: string): Promise<boolean> {
  const userAgent = "AsklyBot";
  try {
    const origin = new URL(url).origin;
    const robotsUrl = `${origin}/robots.txt`;
    const res = await axios.get(robotsUrl, { timeout: 3000 });
    const robots = robotsParser(robotsUrl, res.data);
    const allowed = robots.isAllowed(url, userAgent);
    return allowed !== false;
  } catch {
    return true;
  }
}
async function extractResourcesFromHtml(
  html: string,
  pageUrl: string,
  opts: {
    includeImages: boolean;
    includePdfs: boolean;
    includeText: boolean;
    baseUrl: string;
  }
): Promise<CrawledResource[]> {
  const resources: CrawledResource[] = [];
  const { document } = parseHTML(html);

  if (opts.includeText) {
    const title =
      document.querySelector("title")?.textContent?.trim() || "Untitled Page";

    const content = extractText(document);
    if (content.length > 50) {
      resources.push({
        url: pageUrl,
        type: "text",
        title,
        contentHash: hashString(content),
        sourceUrl: pageUrl,
      });
    }
  }

  if (opts.includeImages) {
    for (const img of Array.from(document.querySelectorAll("img[src]"))) {
      const src = img.getAttribute("src");
      if (!src || src.startsWith("data:") || src.endsWith(".svg")) continue;
      const imageUrl = new URL(src, pageUrl).href;
      resources.push({
        url: imageUrl,
        type: "image",
        title: getFilenameFromUrl(imageUrl),
        contentHash: hashString(imageUrl),
        sourceUrl: pageUrl,
      });
    }
  }

  if (opts.includePdfs) {
    for (const a of Array.from(document.querySelectorAll("a[href]"))) {
      const href = a.getAttribute("href");
      if (!href?.toLowerCase().includes(".pdf")) continue;
      const pdfUrl = new URL(href, pageUrl).href;
      resources.push({
        url: pdfUrl,
        type: "pdf",
        title: getFilenameFromUrl(pdfUrl),
        contentHash: hashString(pdfUrl),
        sourceUrl: pageUrl,
      });
    }
  }

  return resources;
}

function extractLinks(html: string, pageUrl: string, origin: string): string[] {
  const { document } = parseHTML(html);
  const links: string[] = [];
  for (const a of Array.from(document.querySelectorAll("a[href]"))) {
    try {
      const full = new URL(a.getAttribute("href")!, pageUrl);
      if (full.origin === origin) {
        full.hash = "";
        links.push(full.href);
      }
    } catch {}
  }
  return links;
}

function extractText(doc: Document): string {
  const clone = doc.cloneNode(true) as Document;

  for (const el of Array.from(
    clone.querySelectorAll("script,style,nav,footer,header,aside,iframe")
  )) {
    el.remove();
  }

  const text = clone.textContent ?? "";
  return text.replace(/\s+/g, " ").trim();
}

function hashString(str: string): string {
  return CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex);
}

function hashBytes(arr: Uint8Array): string {
  const wordArray = CryptoJS.lib.WordArray.create(arr);
  return CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);
}

function normalizeUrl(url: string): string {
  const u = new URL(url);
  u.hash = "";
  if (u.pathname.endsWith("/") && u.pathname !== "/") {
    u.pathname = u.pathname.slice(0, -1);
  }
  return u.href;
}

function getFilenameFromUrl(url: string): string {
  const path = new URL(url).pathname;
  return decodeURIComponent(path.split("/").pop() || "file");
}

function deduplicateResources(arr: CrawledResource[]): CrawledResource[] {
  const map = new Map<string, CrawledResource>();
  for (const r of arr) {
    if (!map.has(r.contentHash)) map.set(r.contentHash, r);
  }
  return [...map.values()];
}

function delay(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}
