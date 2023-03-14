import { defineConfig } from "vite"
import Vue from "@vitejs/plugin-vue"
import unocss from "unocss/vite"

export default defineConfig({
  plugins: [
    Vue(), 
    unocss()
  ],
  build:{
    // minify: false,
  }
})
