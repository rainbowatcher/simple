import axios from "axios"

const client = axios.create({
  baseURL: "/api/datasources",
})

export default client