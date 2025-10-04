import { build } from "esbuild";

await build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.mjs",
  platform: "node",
  target: ["node18"],
  format: "esm",
  bundle: true,
  sourcemap: false,
  minify: false,
});

await build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.cjs",
  platform: "node",
  target: ["node18"],
  format: "cjs",
  bundle: true,
  sourcemap: false,
  minify: false,
});
