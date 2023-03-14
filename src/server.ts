import { createApp, toNodeListener, fromNodeMiddleware, createRouter } from "h3"
import mri from "mri"
import setupRouter from "./router"
import { createServer } from "node:http"
import * as vite from "vite"
import fs from "node:fs"
import sirv from "sirv"

const isDev = process.env.NODE_ENV === "production" ? false : true

function isStaticFilePath(path: string) {
  return path.match(/\.\w+$/)
}

async function createSimpleServer() {
  const { d, debug } = mri(process.argv.slice(2))

  const app = createApp({ debug: d || debug })
  const listener = toNodeListener(app)
  const router = createRouter()
  const server = createServer(listener)

  if (isDev) {
    const viteServer = await vite.createServer({
      root: process.cwd(),
      server: {
        middlewareMode: true,
      },
    })

    app.use(fromNodeMiddleware(viteServer.middlewares))
  } else {
    const config = await vite.resolveConfig({}, "build")
    const outdir = config.build?.outDir
    if (!fs.existsSync(outdir)) {
      await vite.build()
    }
    app.use(fromNodeMiddleware(sirv(config.build?.outDir)))
  }

  app.use(router)
  server.listen(3210, () =>
    console.log("Server start listening at: http://localhost:3210")
  )

  return {
    server,
    router,
    app,
  }
}

async function bootstrap() {
  const { app, server, router } = await createSimpleServer()
  setupRouter(router)
}

void bootstrap()
