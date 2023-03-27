import { readFile } from "node:fs/promises"
import path from "node:path"
import * as fs from "fs-extra"
import { createIfNotExists, getUserConfigDir } from "../utils/path"
import useLogger from "../utils/logger"
import type {
  DataSourceVO,
  DataSourceConfig,
  DataSourceType,
  DataSourceSchema } from "../domain"
import { DataSourceDO, dataSourceVoValidator } from "../domain"
import { Responses } from "../utils/http"

export const ConfigFileName = "datasources.json"
const logger = useLogger("datasources:service")

export class DataSourceService {
  configFilePath() {
    const configDir = getUserConfigDir()
    return path.resolve(configDir, ConfigFileName)
  }

  async getAll() {
    const configPath = this.configFilePath()
    let config: DataSourceConfig = {}
    await createIfNotExists(configPath, "{}")

    try {
      const configFile = await readFile(configPath, { encoding: "utf-8" })
      config = JSON.parse(configFile) as DataSourceConfig
    } catch (error) {
      logger.error("DataSource config is invalid")
      throw error
    }

    return config
  }

  async getVOList() {
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

    return Responses.SUCCESS.withData(vos)
  }

  async add(vo?: DataSourceVO) {
    if (!vo) return Responses.MISSING_PARAM

    const configPath = this.configFilePath()
    const dataSources = await this.getAll()
    const dataSourceDO = DataSourceDO.fromVO(vo)
    const resp = await this.validate(vo)
    if (resp) return resp

    const { type, name } = vo
    const dataSource = dataSources[type]
    if (dataSource) {
      if (dataSource[name]) {
        return Responses.CONFLICT.withMsg(
          "Datasource %s with type %s already exists",
          vo.name,
          vo.type,
        )
      } else {
        dataSource[name] = dataSourceDO
      }
    } else {
      dataSources[type] = {
        [name]: dataSourceDO,
      }
    }

    logger.info("write config to path `%s`", configPath)
    await fs.writeFile(configPath, JSON.stringify(dataSources), "utf-8")
    return Responses.SUCCESS
  }

  async del(schema?: DataSourceSchema) {
    const isValid = schema && schema.name && schema.type
    if (!isValid) {
      return Responses.MISSING_PARAM
    }

    const { type, name } = schema
    const datasources = await this.getAll()
    if (datasources[type]?.[name]) {
      delete datasources[type]?.[name]
      const configPath = this.configFilePath()
      await fs.writeFile(configPath, JSON.stringify(datasources), "utf-8")
      return Responses.SUCCESS
    } else {
      return Responses.NOT_FOUND.withMsg("DataSource %s not exists", name)
    }
  }

  async update(vo?: DataSourceVO) {
    if (!vo) return Responses.MISSING_PARAM
    const resp = await this.validate(vo)
    if (resp) return resp

    const all = await this.getAll()
    const { type, name } = vo
    const dataSource = all[type]
    if (dataSource?.[name]) {
      dataSource[name] = DataSourceDO.fromVO(vo)
      try {
        await fs.writeFile(this.configFilePath(), JSON.stringify(all), "utf-8")
      } catch (error: unknown) {
        logger.error("Config update fail")
        throw error
      }
      return Responses.SUCCESS
    } else {
      return Responses.NOT_FOUND.withMsg(
        "Type %s with name %s not found",
        vo.type,
        vo.name,
      )
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
      return Responses.INVALID_PARAM.withMsg(
        "%s at field '%s'",
        firstIssue.message,
        firstIssue.path[0],
      )
    }
  }
}
