import { useAxios } from "@vueuse/integrations/useAxios"
import type { DataSourceType, DataSourceVO } from "src/server/domain"
import type { Resp } from "src/server/utils/http"
import type { FormRules } from "naive-ui"
import validator from "validator"
import { isString } from "@vueuse/core"
import client from "./client"

export const reqDataSources = () => {
  return useAxios<Resp<DataSourceVO[]>>("/datasources", client)
}

export const reqAddDataSource = (data: DataSourceVO) => {
  return useAxios<Resp<DataSourceVO>>("/datasources/add", { method: "POST", data }, client)
}

export const reqDelDataSource = (type: DataSourceType, name: string) => {
  return useAxios<Resp>(
    "/datasources/del",
    {
      method: "DELETE",
      data: {
        type,
        name,
      },
    },
    client,
  )
}

export const reqUpdate = (data: DataSourceVO) => {
  return useAxios<Resp>("/datasources/update", { method: "POST", data }, client)
}

export const useDataSourceFormRules = (): FormRules => ({
  host: {
    required: true,
    trigger: "blur",
    validator: (_, value) => isString(value) && (validator.isIP(value) || validator.isFQDN(value)),
  },
  port: {
    required: true,
    trigger: "blur",
    validator: (_, value) => {
      if (!value) {
        return new Error("port is required")
      } else if (Number.isNaN(Number(value))) {
        return new Error("Not a number")
      } else if (Number(value) < 0) {
        return new Error("Can't less than zero")
      } else if (Number(value) > 65535) {
        return new Error("Can't greater than 65535")
      }
      return true
    },
  },
  name: { required: true, trigger: "blur" },
  type: { required: true, trigger: "blur" },
  user: { required: false },
  password: { required: false },
  database: { required: false },
})
