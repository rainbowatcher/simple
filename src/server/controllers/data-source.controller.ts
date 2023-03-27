import h3, {
  eventHandler,
  Router,
} from "h3"
import useLogger from "../utils/logger"
import { parseRequest } from "../utils/http"
import { DataSourceService } from "../service"
import { DataSourceSchema, DataSourceVO } from "../domain"


const logger = useLogger("datasource")
const API_PATH = "/api/datasources"
const dataSourceService = new DataSourceService()

export function DataSourceController(router: Router) {
  router.get(
    API_PATH,
    eventHandler(async (e) => {
      await parseRequest(e)
      return await (await dataSourceService.getVOList()).send(e)
    })
  )

  router.post(
    API_PATH + "/add",
    eventHandler(async (e) => {
      const { body } = await parseRequest(e)
      return await (await dataSourceService.add(body)).send(e)
    })
  )

  router.delete(
    API_PATH + "/del",
    eventHandler(async (e) => {
      const { body } = await parseRequest<DataSourceSchema>(e)
      return await (await dataSourceService.del(body)).send(e)
    })
  )

  router.post(
    API_PATH + "/update",
    eventHandler(async (e) => {
      const { body } = await parseRequest<DataSourceVO>(e)
      return await (await dataSourceService.update(body)).send(e)
    })
  )
}
