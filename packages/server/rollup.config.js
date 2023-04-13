import { defineConfig } from "rollup"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import { visualizer } from "rollup-plugin-visualizer"
import { terser } from "rollup-plugin-terser"
// @ts-expect-error type
import clear from "rollup-plugin-clear"

export default defineConfig({
  input: "src/server.ts",
  plugins: [
    nodeResolve(),
    typescript(),
    commonjs(),
    json(),
    clear({ targets: ["../../dist"] }),
    visualizer({ filename: "../../stats-server.html" }),
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