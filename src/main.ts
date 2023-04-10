import { createApp } from "vue"
import { createRouter, createWebHistory } from "vue-router/auto"
import App from "./App.vue"

import "@unocss/reset/normalize.css"
import "virtual:uno.css"

const router = createRouter({ history: createWebHistory() })
const app = createApp(App)
app.use(router)
app.config.errorHandler = (err, ins, info) => {
  console.log("err: ", err)
  console.log("instance: ", ins)
  console.log("info: ", info)
}
app.mount("#app")
