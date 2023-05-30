import { defineConfig, presetAttributify, presetIcons, presetUno } from "unocss"
import { useAppConfig } from "./packages/web/src/composables/config"

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