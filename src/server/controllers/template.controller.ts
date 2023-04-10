import type { Router } from "h3"
import { eventHandler } from "h3"
import { parseRequest, responses } from "../utils/http"
import { TemplateService } from "../service"

const apiPath = "/api/template"
const templateService = new TemplateService()

function templateController(router: Router) {
  router.get(
    apiPath, eventHandler(async (e) => {
      await parseRequest(e)
      const res = await templateService.loadAll()
      return res.send(e)
    }),
  )

  router.post(
    `${apiPath}/add`, eventHandler(async (e) => {
      const { body } = await parseRequest<{name:string; content: string}>(e)
      const res = await templateService.save(body?.name, body?.content)
      return res.send(e)
    }),
  )

  router.post(
    `${apiPath}/save`, eventHandler(async (e) => {
      await parseRequest(e)
      const { body } = await parseRequest<{path:string; content: string; update: boolean}>(e)
      const res = await templateService.save(body?.path, body?.content, body?.update)
      return res.send(e)
    }),
  )

  router.delete(
    `${apiPath}/trash`, eventHandler(async (e) => {
      await parseRequest(e)
      const { body } = await parseRequest<{name:string; physics:boolean}>(e)
      const res = await templateService.trash(body?.name, body?.physics)
      return res.send(e)
    }),
  )

  router.post(
    `${apiPath}/folder`, eventHandler(async (e) => {
      const { body } = await parseRequest<{name:string; content: string}>(e)
      const res = await templateService.createFolder(body?.name)
      return res.send(e)
    }),
  )

  router.get(
    `${apiPath}/get`, eventHandler(async (e) => {
      const { url } = await parseRequest(e)
      const path = url.searchParams.get("path")
      // @ts-expect-error null
      const res = await templateService.loadTemplate(path)
      return res.send(e)
    }),
  )
}

export { templateController }