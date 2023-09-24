import { useAxios } from "@vueuse/integrations/useAxios"
import type { DataSourceType, DataSourceVO } from "server/domain"
import type { Resp } from "server/utils/http"
import type { FormRules } from "naive-ui"
import isIP from "validator/es/lib/isIP"
import isFQDN from "validator/es/lib/isFQDN"
import client from "./client"

export function reqDataSources() {
  return useAxios<Resp<DataSourceVO[]>>("/datasources", client)
}

export function reqAddDataSource(data: DataSourceVO) {
  return useAxios<Resp<DataSourceVO>>("/datasources/add", { method: "POST", data }, client)
}

export function reqDelDataSource(type: DataSourceType, name: string) {
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

export function reqUpdate(data: DataSourceVO) {
  return useAxios<Resp>("/datasources/update", { method: "POST", data }, client)
}

export function useDataSourceFormRules(): FormRules {
  return {
    host: {
      required: true,
      trigger: "blur",
      validator: (_, value) => typeof value === "string" && (isIP(value) || isFQDN(value)),
    },
    port: {
      required: true,
      trigger: "blur",
      validator: (_, value) => {
        if (!value) {
          return new Error("port is required")
        }
        else if (Number.isNaN(Number(value))) {
          return new Error("Not a number")
        }
        else if (Number(value) < 0) {
          return new Error("Can't less than zero")
        }
        else if (Number(value) > 65535) {
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
  }
}
