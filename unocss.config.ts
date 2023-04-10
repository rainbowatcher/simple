import { defineConfig } from "unocss"
import presetIcons from "@unocss/preset-icons"
import presetUno from "@unocss/preset-uno"
import presetAttributify from "@unocss/preset-attributify"
import { useAppConfig } from "./src/composables/config"

export default defineConfig({
  shortcuts: [
    ["btn", "px1 cursor-pointer select-none hover:text-emerald-600"],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        display: "inline-block",
      },
      collections: {
        carbon: () => import("@iconify-json/carbon/icons.json").then(i => i.default),
        mdi: () => import("@iconify-json/mdi/icons.json").then(i => i.default),
      },
    }),
  ],
  safelist: [
    "i-mdi-file",
    "i-mdi-folder",
    "i-mdi-folder-open",
    "i-simple-icons-handlebarsdotjs",
    ...useAppConfig().sideMenu.map(i => i.icon),
  ],
})