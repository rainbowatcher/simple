import { createRouter, eventHandler } from "h3"
import * as controllers from "../controllers"
import { parseRequest, responses } from "../utils/http"

const router = createRouter()

router.use(
  "/api/**",
  eventHandler(async (e) => {
    await parseRequest(e)
    await responses.NOT_FOUND.send(e)
  }),
)

for (const controller of Object.values(controllers)) {
  controller(router)
}

export default router
