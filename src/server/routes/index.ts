import { createRouter, eventHandler } from "h3"
import * as controllers from "../controllers"
import { parseRequest, Responses } from "../utils/http"

const router = createRouter()

router.use(
  "/api/**",
  eventHandler(async (e) => {
    await parseRequest(e)
    await Responses.NOT_FOUND.send(e)
  }),
)

for (const controller of Object.values(controllers)) {
  controller(router)
}

export default router
