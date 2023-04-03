import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
} from "unocss"
import { useAppConfig } from "./src/composables/config"

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
  ],
  safelist: [...useAppConfig().sideMenu.map(i => i.icon)],
})