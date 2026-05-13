/**
 * Builds the app, starts production server on a spare port, captures /demo
 * full-page to docs/readme-ui.png for README.md.
 */
import { execSync, spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { chromium } from "playwright";
import treeKill from "tree-kill";

const treeKillAsync = promisify(treeKill);

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const PORT = String(process.env.CAPTURE_PORT ?? "3010");
const base = `http://127.0.0.1:${PORT}`;

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForHttp(url, maxMs) {
  const deadline = Date.now() + maxMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (res.ok) return;
    } catch {
      /* retry */
    }
    await wait(400);
  }
  throw new Error(`Server did not become ready: ${url}`);
}

async function stopServer(proc) {
  if (!proc.pid) return;
  try {
    await treeKillAsync(proc.pid, "SIGTERM");
  } catch {
    try {
      await treeKillAsync(proc.pid, "SIGKILL");
    } catch {
      /* ignore */
    }
  }
}

console.log("Building…");
execSync("npm run build", { cwd: root, stdio: "inherit", env: process.env, shell: true });

console.log(`Starting production server on port ${PORT}…`);
const server = spawn("npm", ["run", "start", "--", "-p", PORT], {
  cwd: root,
  stdio: "inherit",
  shell: true,
  env: { ...process.env, PORT },
});

try {
  await waitForHttp(`${base}/demo`, 120_000);

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 2,
  });
  await page.goto(`${base}/demo`, {
    waitUntil: "networkidle",
    timeout: 60_000,
  });

  const outDir = join(root, "docs");
  await mkdir(outDir, { recursive: true });
  const outFile = join(outDir, "readme-ui.png");
  await page.screenshot({ path: outFile, fullPage: true });
  await browser.close();
  console.log("Wrote", outFile);
} finally {
  await stopServer(server);
  await wait(800);
}
