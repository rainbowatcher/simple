import { createServer } from "node:http"
import { basename } from "node:path"
import * as h3 from "h3"
import sirv from "sirv"
import router from "./routes"
import { getLogger } from "./utils/logger"

const isDev = process.env.NODE_ENV === "development"
const logger = getLogger(basename(import.meta.url))

const app = h3.createApp()
app.use(router)
const listener = h3.toNodeListener(app)
const server = createServer(listener)

if (isDev) {
  logger.info("Start in development mode")
  void import("vite").then((vite) => {
    vite.createServer({
      root: "../web",
      server: {
        middlewareMode: true,
        // hmr: server,
      },
    }).then((viteServer) => {
      logger.info("Create vite server in middleware mode")
      server.on("close", () => {
        logger.info("Detect server close, close vite server")
        viteServer.close().catch(() => { logger.error("Vite server stop failed") })
      })
      // if frontend router did not match, then fallback to backend router
      app.use(h3.fromNodeMiddleware(viteServer.middlewares))
    }).catch(() => {
      logger.error("Vite server start failed")
    })
  })
}
else {
  logger.info("Start in production mode")
  logger.info("Serve static file")
  app.use(
    h3.fromNodeMiddleware(
      sirv("dist", { single: true }),
    ),
  )
}

server.listen(3210, () => { logger.info("Server start listening at http://localhost:%d", 3210) })
