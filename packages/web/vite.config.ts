import path from "node:path"
import { defineConfig } from "vite"
import Vue from "@vitejs/plugin-vue"
import unocss from "unocss/vite"
import AutoImport from "unplugin-auto-import/vite"
import VueComponent from "unplugin-vue-components/vite"
import { NaiveUiResolver } from "unplugin-vue-components/resolvers"
import { visualizer } from "rollup-plugin-visualizer"
import Pages from "vite-plugin-pages"

export default defineConfig({
  resolve: {
    alias: {
      "server/": `${path.resolve(process.cwd(), "../server/src")}/`,
    },
  },
  plugins: [
    Vue(),
    AutoImport({
      imports: [
        "vue",
        "@vueuse/core",
        "vue-router",
        {
          "naive-ui": [
            "useDialog",
            "useMessage",
            "useNotification",
            "useLoadingBar",
            "createDiscreteApi",
          ],
        },
      ],
      dirs: ["src/composables/**"],
      vueTemplate: true,
      dts: "src/auto-imports.d.ts",
    }),
    VueComponent({
      resolvers: [NaiveUiResolver()],
      include: [/\.vue$/, /\.vue\?vue/],
      dts: "src/components.d.ts",
    }),
    Pages(),
    unocss(),
    visualizer({
      filename: "../../stats-client.html",
    }),
  ],
  // currently dev only
  optimizeDeps: {
    include: [
      "monaco-editor/esm/vs/language/json/json.worker",
      "monaco-editor/esm/vs/language/css/css.worker",
      "monaco-editor/esm/vs/language/html/html.worker",
      "monaco-editor/esm/vs/language/typescript/ts.worker",
      "monaco-editor/esm/vs/editor/editor.worker",
      "monaco-editor",
      "naive-ui",
    ],
  },
  clearScreen: false,
  build: {
    rollupOptions: {
      treeshake: "recommended",
    },
    emptyOutDir: false,
    outDir: "../../dist",
  },
})
