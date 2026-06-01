import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

// Load without waiting for network idle (prediction polling keeps network busy)
await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded", timeout: 20000 });
await page.waitForTimeout(3500);

// Hero
await page.evaluate(() => window.scrollTo({ top: 0 }));
await page.waitForTimeout(600);
await page.screenshot({ path: path.join(__dirname, "shot_hero.png") });

// Translator
await page.evaluate(() => window.scrollTo({ top: document.getElementById("translator")?.offsetTop ?? 900 }));
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(__dirname, "shot_translator.png") });

// How it works
await page.evaluate(() => window.scrollTo({ top: document.getElementById("how-it-works")?.offsetTop ?? 2600 }));
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(__dirname, "shot_how.png") });

// Features
await page.evaluate(() => window.scrollTo({ top: document.getElementById("features")?.offsetTop ?? 3800 }));
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(__dirname, "shot_features.png") });

// Full page
await page.evaluate(() => window.scrollTo({ top: 0 }));
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(__dirname, "shot_full.png"), fullPage: true });

await browser.close();
console.log("Done.");
