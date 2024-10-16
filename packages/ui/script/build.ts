#!/usr/bin/env -S pnpm tsx

import { Command } from "@commander-js/extra-typings";
import { context } from "esbuild";
import pkg from "../package.json" with { type: "json" };

const program = new Command()
  .description(`Build script for ${pkg.name}`)
  .version(pkg.version)
  .option("-w, --watch", "enable watch mode", false)
  .parse(process.argv);

const { watch } = program.opts();

const ctx = await context({
  entryPoints: [
    // The whole library
    "./src/index.ts",

    // Controllers
    "./src/controllers/*.ts",
  ],
  outdir: "dist",
  target: "es2022",
  format: "esm",
  bundle: true,
  splitting: true,
  chunkNames: "chunks/[name].[hash]",
  packages: "external",
});

if (watch) {
  await ctx.watch();
} else {
  await ctx.rebuild();
  await ctx.dispose();
}
