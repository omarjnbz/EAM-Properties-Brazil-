// Prints each free country guide to a PDF in public/guides.
//
//   npm run dev            (or: npm run build && npm start)
//   npm run guides:pdf     (defaults to http://localhost:3000)
//
// Options: SITE_URL=http://localhost:3100 CHROME_PATH=/path/to/chrome npm run guides:pdf
import { mkdir, stat } from "node:fs/promises";
import puppeteer from "puppeteer-core";

const SITE_URL = (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
const CHROME_PATH = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const GUIDES = [
  { key: "brazil", file: "public/guides/eam-global-brazil-guide-2026.pdf" },
  { key: "argentina", file: "public/guides/eam-global-argentina-guide-2026.pdf" },
];

await mkdir("public/guides", { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: true });
try {
  for (const g of GUIDES) {
    const page = await browser.newPage();
    await page.emulateMediaType("print");
    // Ask the image optimiser for JPEG: Chrome embeds JPEGs as-is, which keeps the PDFs small.
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (req.resourceType() === "image") req.continue({ headers: { ...req.headers(), accept: "image/jpeg,image/png;q=0.9,*/*;q=0.5" } });
      else req.continue();
    });
    const res = await page.goto(`${SITE_URL}/guides/${g.key}/print`, { waitUntil: "networkidle0", timeout: 120000 });
    if (!res || !res.ok()) throw new Error(`Could not open the ${g.key} guide (HTTP ${res?.status()})`);
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: g.file, printBackground: true, preferCSSPageSize: true });
    const { size } = await stat(g.file);
    console.log(`${g.file}  ${(size / 1024).toFixed(0)} KB`);
    await page.close();
  }
} finally {
  await browser.close();
}
