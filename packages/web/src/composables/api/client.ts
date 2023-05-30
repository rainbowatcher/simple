import type { AxiosResponse, CreateAxiosDefaults } from "axios"
import axios from "axios"
import type { Resp } from "server/utils/http"

const client = axios.create({
  baseURL: "/api",
} satisfies CreateAxiosDefaults<unknown>)

client.interceptors.response.use((res: AxiosResponse<Resp, any>) => {
  const { messager } = useDiscreteApi()
  if (res.data.status > 10000) {
    messager.error(res.data.message)
  }
  return res
})

export default client