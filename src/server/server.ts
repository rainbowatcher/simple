import { createServer } from "node:http"
import fs from "node:fs"
import * as h3 from "h3"
import * as vite from "vite"
import sirv from "sirv"
import useLogger from "./utils/logger"
import router from "./routes"

const isDev = process.env.NODE_ENV === "development"
const logger = useLogger("server")

const app = h3.createApp()
app.use(router)
const listener = h3.toNodeListener(app)
const server = createServer(listener)

if (isDev) {
  logger.info("Start in development mode")
  vite.createServer({
    // looks like it is unnecessary. because the default root is process.cwd().
    // root: projectRoot,
    server: {
      middlewareMode: true,
    },
  }).then((viteServer) => {
    logger.info("Create vite server in middleware mode")
    server.on("close", () => {
      logger.info("Detect server close, close vite server")
      viteServer.close().catch(() => logger.error("Vite server stop failed"))
    })
    // if frontend router did not match,then fallback to backend router
    router.get("/**", h3.fromNodeMiddleware(viteServer.middlewares))
  }).catch(() => {
    logger.error("Vite server start failed")
  })
} else {
  logger.info("Start in production mode")
  vite.resolveConfig({}, "build").then(async (config) => {
    const outdir = config.build?.outDir
    if (!fs.existsSync(outdir)) {
      logger.info("Dist dir not found, begin run vite build.")
      await vite.build()
    }
    logger.info("Serve static file at `%s`", outdir)
    app.use(
      h3.fromNodeMiddleware(
        sirv(config.build?.outDir, {
          // newbee
          single: true,
        }),
      ),
    )
  }).catch(() => {
    logger.error("Get vite build dir failed")
  })
}

server.listen(3210, () =>
  logger.info("Server start listening at `http://localhost:%d`", 3210),
)
