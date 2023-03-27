import h3 from "h3"
import { createServer } from "node:http"
import * as vite from "vite"
import fs from "node:fs"
import sirv from "sirv"
import { projectRoot } from "./utils/path"
import useLogger from "./utils/logger"
import router from "./routes"

const isDev = process.env.NODE_ENV === "production" ? false : true
const logger = useLogger("server")

const app = h3.createApp()
app.use(router)
const listener = h3.toNodeListener(app)
const server = createServer(listener)

if (isDev) {
  logger.info("Start in development mode, use vite in middleware mode.")
  vite
    .createServer({
      root: projectRoot,
      server: {
        middlewareMode: true,
      },
    })
    .then((viteServer) => {
      server.on("close", () => viteServer.close())
      // if frontend router did not match,then fallback to backend router
      router.get("/**", h3.fromNodeMiddleware(viteServer.middlewares))
    })
} else {
  vite.resolveConfig({}, "build").then(async (config) => {
    const outdir = config.build?.outDir
    if (!fs.existsSync(outdir)) {
      logger.info("Dist dir not found, begin run vite build.")
      await vite.build()
    }
    logger.info("Start in production mode, serve static file at `%s`", outdir)
    app.use(
      h3.fromNodeMiddleware(
        sirv(config.build?.outDir, {
          // newbee
          single: true,
        })
      )
    )
  })
}

server.listen(3210, () =>
  logger.info("Server start listening at `http://localhost:%d`", 3210)
)
