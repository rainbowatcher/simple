import type { Router } from "h3"
import { eventHandler } from "h3"
import { parseRequest } from "../utils/http"
import { TemplateService } from "../service"

const apiPath = "/api/template/"
const templateService = new TemplateService()

function templateController(router: Router) {
  router.get(
    apiPath, eventHandler(async (e) => {
      await parseRequest(e)
      const list = await templateService.loadAll()
      return list.send(e)
    }),
  )
}

export { templateController }