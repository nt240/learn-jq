import { copyFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, "..");
const src = path.join(repoRoot, "node_modules", "jq-web", "jq.wasm");
const destDir = path.join(repoRoot, "public");
const dest = path.join(destDir, "jq.wasm");

async function main() {
  try {
    await stat(src);
  } catch {
    throw new Error(
      `jq-web wasm not found at ${src}. Did you run npm install?`
    );
  }

  await mkdir(destDir, { recursive: true });
  await copyFile(src, dest);
  console.log(`Copied jq.wasm -> ${path.relative(repoRoot, dest)}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
});
