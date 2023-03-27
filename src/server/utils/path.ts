import fs from "fs-extra"
import os from "node:os"
import path from "node:path"

export const projectRoot = process.cwd()
export const userHomeDir = os.homedir()
export const platform: NodeJS.Platform = os.platform()
export const projectName = "Simple"

export const linuxConfigDir = `${userHomeDir}/.config`
export const linuxDataDir = `${userHomeDir}/.local/share`

export const macOSConfigDir = `${userHomeDir}/Library/Application Support`
export const macOSDataDir = macOSConfigDir

export const winConfigDir = `${userHomeDir}\\AppData\\Roaming`
export const winDataDir = winConfigDir

export const getUserConfigDir = () => {
  switch (platform) {
    case "darwin":
      return `${macOSConfigDir}/${projectName}`
    case "linux":
      return `${linuxConfigDir}/${projectName}`
    case "win32":
      return `${winConfigDir}/${projectName}`
    default:
      // should never reach this
      throw new Error(`The platform [${platform}] is not supported.`)
  }
}

export const getUserDataDir = () => {
  switch (platform) {
    case "darwin":
      return `${macOSDataDir}/${projectName}`
    case "linux":
      return `${linuxDataDir}/${projectName}`
    case "win32":
      return `${winDataDir}/${projectName}`
    default:
      // should never reach this
      throw new Error(`The platform [${platform}] is not supported.`)
  }
}

export const getUserConfigPath = () => `${getUserConfigDir()}/simple.json`

export const getLogDir = () => {
  const dataDir = getUserDataDir()
  return path.resolve(dataDir, "log")
}

export async function createIfNotExists(configFilePath: string, initContent?: string) {
  const fileExists = await fs.exists(configFilePath)
  if (!fileExists) {
    await fs.createFile(configFilePath)
    if (initContent) await fs.writeFile(configFilePath, initContent)
  }
}