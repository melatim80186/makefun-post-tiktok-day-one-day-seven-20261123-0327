#!/usr/bin/env node
/**
 * make.fun entry: post-tiktok-day-one-day-seven-20261123-0327.
 *
 * Copies VIDEO.json (the TikTok video's address) to /output/VIDEO.json.
 * Node 22, stdlib only, no network, deterministic.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "VIDEO.json");
const OUT_DIR = "/output";
const DST = join(OUT_DIR, "VIDEO.json");

if (!existsSync(SRC)) {
  console.error("VIDEO.json not found next to main.ts");
  process.exit(1);
}
// Guard: only copy a VIDEO.json that parses and names a video address,
// so a broken or empty link file fails loudly instead of shipping.
let parsed: unknown;
try {
  parsed = JSON.parse(readFileSync(SRC, "utf8"));
} catch {
  console.error("VIDEO.json is not valid JSON");
  process.exit(1);
}
if (
  typeof parsed !== "object" ||
  parsed === null ||
  typeof (parsed as { url?: unknown }).url !== "string" ||
  !(parsed as { url: string }).url
) {
  console.error("VIDEO.json must contain a non-empty string field 'url'");
  process.exit(1);
}
mkdirSync(OUT_DIR, { recursive: true });
copyFileSync(SRC, DST);
console.log("wrote " + DST);
