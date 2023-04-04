import { z } from "zod"
import validator from "validator"

export const dataSourceTypes = [
  "hive",
  "mysql",
  "mssql",
  "oracle",
  "clickhouse",
  "elasticSearch",
] as const
export type DataSourceType = typeof dataSourceTypes[number]
export type DataSourceSchema = {
  name: string
  type: DataSourceType
}
export type DataSourceConfig = {
  [key in DataSourceType]?: Record<string, DataSourceDO>
}

export class DataSourceDO {
  static fromVO(vo: DataSourceVO) {
    return new DataSourceDO(
      vo.host,
      Number(vo.port),
      vo.user,
      vo.password,
      vo.database,
    )
  }

  constructor(
    public host: string,
    public port: number | string,
    public user?: string,
    public password?: string,
    public database?: string,
  ) {}

}

export const dataSourceVoValidator = z.object({
  type: z.enum(dataSourceTypes),
  name: z.string(),
  host: z
    .string()
    .refine(
      str => validator.isFQDN(str) || validator.isIP(str),
      "Not a valid domain or IP address",
    ),
  port: z.string().refine(str => validator.isPort(str)),
  user: z.string().optional(),
  password: z.string().optional(),
  database: z.string().optional(),
})

export type DataSourceVO = z.infer<typeof dataSourceVoValidator>

