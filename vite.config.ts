import path from "node:path"
import { defineConfig } from "vite"
import Vue from "@vitejs/plugin-vue"
import unocss from "unocss/vite"
import AutoImport from "unplugin-auto-import/vite"
import VueComponent from "unplugin-vue-components/vite"
import { VueRouterAutoImports } from "unplugin-vue-router"
import { NaiveUiResolver } from "unplugin-vue-components/resolvers"
import VueRouter from "unplugin-vue-router/vite"
import { visualizer } from "rollup-plugin-visualizer"
import { MagicRegExpTransformPlugin } from "magic-regexp/transform"

export default defineConfig({
  resolve: {
    alias: {
      "src/": `${path.resolve(__dirname, "src")}/`,
    },
  },
  plugins: [
    VueRouter({
      dts: "src/vue-router.d.ts",
    }),
    Vue(),
    AutoImport({
      imports: [
        "vue",
        "@vueuse/core",
        VueRouterAutoImports,
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
    unocss(),
    visualizer({
      filename: "stats.html",
    }),
    MagicRegExpTransformPlugin.vite(),
  ],
  build: {
    // minify: false,
    // rollupOptions: {
    //   treeshake: "smallest",
    // }
  },
  clearScreen: false,
})
