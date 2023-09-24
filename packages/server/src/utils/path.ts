import os from "node:os"
import path from "node:path"
import fs from "fs-extra"

export const projectRoot = process.cwd()
export const userHomeDir = os.homedir()
export const platform = os.platform()
export const projectName = "Simple"

export const linuxConfigDir = `${userHomeDir}/.config`
export const linuxDataDir = `${userHomeDir}/.local/share`

export const macOSConfigDir = `${userHomeDir}/Library/Application Support`
export const macOSDataDir = macOSConfigDir

export const winConfigDir = `${userHomeDir}\\AppData\\Roaming`
export const winDataDir = winConfigDir

export function getUserConfigDir() {
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

export function getUserDataDir() {
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

export function getLogDir() {
  const dataDir = getUserDataDir()
  return path.resolve(dataDir, "log")
}

export async function createFileIfNotExists(filePath: string, initContent?: string) {
  try {
    const isExists = await fs.exists(filePath)
    if (!isExists) {
      await fs.createFile(filePath)
      if (initContent)
        await fs.writeFile(filePath, initContent)
    }
  }
  catch (e) {
    console.log(String(e))
  }
}

export async function createDirIfNotExists(filePath: string) {
  try {
    const isExists = await fs.exists(filePath)
    if (!isExists) {
      await fs.mkdir(filePath)
    }
  }
  catch (e) {
    console.log(e)
  }
}