import path from "node:path"
import { deleteSync } from "del"
import c from "picocolors"
import { defineConfig } from "rollup"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import { visualizer } from "rollup-plugin-visualizer"

export default defineConfig({
  input: "src/server.ts",
  plugins: [
    nodeResolve(),
    typescript(),
    commonjs(),
    json(),

    visualizer({ filename: "../../stats-server.html" }),
    {
      name: "clear",
      buildStart() {
        const buildPath = path.resolve(process.cwd(), "../../dist")
        console.log(c.green(`deleted ${buildPath}`))
        deleteSync(`${buildPath}/**`, { force: true })
      },
    },
    // terser({ compress: true, ecma: 2020 }),
  ],
  treeshake: "smallest",
  external: [
    // /@?rollup.*/,
    /@?vite.*/,
    // /@?unplugin.*/,
    // /@?unocss.*/,
    // /@?types.*/,
    // /@?iconify.*/,
    // /@?commitlint.*/,
    // /@?vue.*/,
    // /@?esbuild.*/,
    // /@?rollup.*/,
    // "@total-typescript/ts-reset",
    // "axios",
    // "cross-env",
    // "eslint",
    // "husky",
    // "jiti",
  ],
  output: {
    dir: "../../dist",
    compact: true,
    format: "esm",
  },
})