import path, { basename } from "node:path"
import fs from "node:fs/promises"
import { createFileIfNotExists, getUserConfigDir } from "../utils/path"
import { getLogger } from "../utils/logger"
import type {
  DataSourceConfig,
  DataSourceSchema,
  DataSourceType,
  DataSourceVO,
} from "../domain"
import { DataSourceDO, dataSourceVoValidator } from "../domain"
import { responses } from "../utils/http"

const logger = getLogger(basename(import.meta.url))

export class DataSourceService {
  static readonly configFileName = "datasources.json"

  configFilePath() {
    const configPath = getUserConfigDir()
    return path.resolve(configPath, DataSourceService.configFileName)
  }

  async getAll() {
    const configPath = this.configFilePath()
    let config: DataSourceConfig = {}
    await createFileIfNotExists(configPath, "{}")

    try {
      const configFile = await fs.readFile(configPath, { encoding: "utf-8" })
      config = JSON.parse(configFile) as DataSourceConfig
    } catch (error) {
      logger.error("DataSource config is invalid")
      throw new Error(String(error))
    }

    return config
  }

  async getVOList() {
    const { SUCCESS } = responses<DataSourceVO[]>()
    const vos: DataSourceVO[] = []

    const dataSources = await this.getAll()
    const types = Object.keys(dataSources) as DataSourceType[]
    for (const type of types) {
      const configPair = dataSources[type]
      if (!configPair) continue
      for (const name of Object.keys(configPair)) {
        const obj = configPair[name]
        vos.push({
          type,
          name,
          ...obj,
          port: `${obj.port}`,
        })
      }
    }

    return SUCCESS.withData(vos)
  }

  async add(vo?: DataSourceVO) {
    const { MISSING_PARAM, CONFLICT, SUCCESS } = responses()
    if (!vo) return MISSING_PARAM

    const configPath = this.configFilePath()
    const dataSources = await this.getAll()
    const dataSourceDO = DataSourceDO.fromVO(vo)
    const resp = await this.validate(vo)
    if (resp) return resp

    const { type, name } = vo
    const dataSource = dataSources[type]
    if (dataSource) {
      if (dataSource[name]) {
        return CONFLICT.withMsg("Datasource %s with type %s already exists", name, type)
      } else {
        dataSource[name] = dataSourceDO
      }
    } else {
      dataSources[type] = {
        [name]: dataSourceDO,
      }
    }

    logger.info("write config to path `%s`", configPath)
    await fs.writeFile(configPath, JSON.stringify(dataSources, null, 2), "utf-8")
    return SUCCESS
  }

  async del(schema?: DataSourceSchema) {
    const { MISSING_PARAM, NOT_FOUND, SUCCESS } = responses()
    const isValid = schema && schema.name && schema.type
    if (!isValid) {
      return MISSING_PARAM
    }

    const { type, name } = schema
    const datasources = await this.getAll()
    if (datasources[type]?.[name]) {
      delete datasources[type]?.[name]
      const configPath = this.configFilePath()
      await fs.writeFile(configPath, JSON.stringify(datasources, null, 2), "utf-8")
      return SUCCESS
    } else {
      return NOT_FOUND.withMsg("DataSource %s not exists", name)
    }
  }

  async update(vo?: DataSourceVO) {
    const { MISSING_PARAM, SUCCESS, NOT_FOUND } = responses()
    if (!vo) return MISSING_PARAM
    const resp = await this.validate(vo)
    if (resp) return resp

    const all = await this.getAll()
    const { type, name } = vo
    const dataSource = all[type]
    if (dataSource?.[name]) {
      dataSource[name] = DataSourceDO.fromVO(vo)
      try {
        await fs.writeFile(this.configFilePath(), JSON.stringify(all, null, 2), "utf-8")
      } catch (error: unknown) {
        logger.error("Config update fail")
        throw error
      }
      return SUCCESS
    } else {
      return NOT_FOUND.withMsg("Type %s with name %s not found", type, name)
    }
  }

  escapeKeyword(word: string, keys: string[]) {
    if (keys.includes(word.toUpperCase())) {
      return `\`${word}\``
    }
    return word
  }

  async validate(vo?: DataSourceVO) {
    const result = await dataSourceVoValidator.safeParseAsync(vo)
    if (!result.success) {
      const firstIssue = result.error.issues[0]
      return responses().INVALID_PARAM.withMsg(
        "%s at field '%s'",
        firstIssue.message,
        firstIssue.path[0],
      )
    }
  }
}
