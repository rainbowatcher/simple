import * as fs from "fs-extra"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { createRegExp } from "magic-regexp"
import { createIfNotExists, getUserConfigDir } from "../utils/path"
import useLogger from "../utils/logger"
import { hostRE } from "../consts/regexp"
import {
  DataSourceDO,
  DataSourceVO,
  DataSourceConfig,
  DataSourceType,
  DataSourceSchema,
  dataSourceVoValidator,
} from "../domain"
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
    for (let type of types) {
      const configPair = dataSources[type]
      if (!configPair) continue
      for (let name of Object.keys(configPair)) {
        const obj = configPair[name]
        vos.push({
          type,
          name,
          ...obj,
          port: obj.port + "",
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
    let resp = await this.validate(vo)
    if (resp) return resp

    if (dataSources[vo.type]) {
      if (dataSources[vo.type]![vo.name]) {
        return Responses.CONFLICT.withMsg(
          "Datasource %s with type %s already exists",
          vo.name,
          vo.type
        )
      } else {
        dataSources[vo.type]![vo.name] = dataSourceDO
      }
    } else {
      dataSources[vo.type] = {
        [vo.name]: dataSourceDO,
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
    if (datasources[type] && datasources[type]![name]) {
      delete datasources[type]![name]
      const configPath = this.configFilePath()
      await fs.writeFile(configPath, JSON.stringify(datasources), "utf-8")
      return Responses.SUCCESS
    } else {
      return Responses.NOT_FOUND.withMsg("DataSource %s not exists", name)
    }
  }

  async update(vo?: DataSourceVO) {
    if (!vo) return Responses.MISSING_PARAM
    let resp = await this.validate(vo)
    if (resp) return resp

    const all = await this.getAll()
    if (all[vo.type]?.[vo.name]) {
      all[vo.type]![vo.name] = DataSourceDO.fromVO(vo)
      await fs.writeFile(this.configFilePath(), JSON.stringify(all), "utf-8")
      return Responses.SUCCESS
    } else {
      return Responses.NOT_FOUND.withMsg(
        "Type %s with name %s not found",
        vo.type,
        vo.name
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
        firstIssue.path[0]
      )
    }
  }
}
