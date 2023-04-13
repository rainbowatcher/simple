import axios from "axios"

const client = axios.create({
  baseURL: "/api",
})

client.interceptors.response.use((res) => {
  const { messager } = useDiscreteApi()
  if (res.data?.status > 10000) {
    messager.error(res.data?.message)
  }
  return res
})

export default client