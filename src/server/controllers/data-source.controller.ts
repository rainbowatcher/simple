import type { Router } from "h3"
import { eventHandler } from "h3"
import { parseRequest } from "../utils/http"
import { DataSourceService } from "../service"
import type { DataSourceSchema, DataSourceVO } from "../domain"

const apiPath = "/api/datasources"
const dataSourceService = new DataSourceService()

export function dataSourceController(router: Router) {
  router.get(
    apiPath,
    eventHandler(async (e) => {
      await parseRequest(e)
      return await (await dataSourceService.getVOList()).send(e)
    }),
  )

  router.post(
    `${apiPath}/add`,
    eventHandler(async (e) => {
      const { body } = await parseRequest(e)
      return await (await dataSourceService.add(body)).send(e)
    }),
  )

  router.delete(
    `${apiPath}/del`,
    eventHandler(async (e) => {
      const { body } = await parseRequest<DataSourceSchema>(e)
      return await (await dataSourceService.del(body)).send(e)
    }),
  )

  router.post(
    `${apiPath}/update`,
    eventHandler(async (e) => {
      const { body } = await parseRequest<DataSourceVO>(e)
      return await (await dataSourceService.update(body)).send(e)
    }),
  )
}
