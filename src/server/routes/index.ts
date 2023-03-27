import { createRouter, eventHandler, send } from "h3"
import * as controllers from "../controllers"
import { parseRequest } from "../utils/http"
import { Responses } from "../utils/http"

const router = createRouter()

router.use(
  "/api/**",
  eventHandler(async (e) => {
    parseRequest(e)
    await Responses.NOT_FOUND.send(e)
  })
)

for (const controller of Object.values(controllers)) {
  controller(router)
}

export default router
