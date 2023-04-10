import { resolve } from "node:path"
import { readFile } from "node:fs/promises"
import { url } from "node:inspector"
import { ensureDir, exists, mkdir, move, pathExists, rm, writeFile } from "fs-extra"
import { globby } from "globby"
import { createDirIfNotExists, getUserConfigDir } from "../utils/path"
import { responses } from "../utils/http"
// import useLogger from "../utils/logger"

// const logger = useLogger("template")
export type FileItem = {
  name: string
  path: string
  children?: FileItem[]
}

export class TemplateService {
  private static readonly rootDir = "templates"
  private static readonly suffix = ".hbs"

  configFileDir() {
    const configDir = getUserConfigDir()
    return resolve(configDir, TemplateService.rootDir)
  }

  async loadAll() {
    const { SUCCESS, IO_ERROR } = responses<FileItem[]>()
    const dir = this.configFileDir()
    await createDirIfNotExists(dir)

    let templates: FileItem[] = []
    try {
      const globs = await globby("**", { cwd: dir, /* ignore: ["trash"], */ markDirectories: true, onlyFiles: false })
      templates = this.toFileTree(globs)
      return SUCCESS.withData(templates)
    } catch (e) {
      return IO_ERROR.withMsg("Fail to read dir: %s", dir)
    }
  }

  async loadFolder(_folder: string) {
    // TODO
  }

  toFileTree(files: string[]) {
    const result: FileItem[] = []
    files.forEach((file) => {
      const isFile = !file.endsWith("/")
      const pathArray = isFile ? file.split("/") : file.slice(0, -1).split("/")
      let currentLevel = result

      pathArray.forEach((name, index) => {
        const existingNode = currentLevel.find(node => node.name === name)

        const newNode: FileItem = {
          name,
          path: file,
          children: [],
        }

        if (existingNode) {
          currentLevel = existingNode.children || []
        } else {
          currentLevel.push(newNode)
          currentLevel = newNode.children!
        }

        if (index === pathArray.length - 1 && isFile) {
          newNode.children = undefined
        }
      })
    })
    return result
  }

  /**
   * save template content to disk
   * @param path template file path
   * @param content template file content
   * @param update is update operation
   */
  async save(path?: string, content = "", update = false) {
    const { SUCCESS, CONFLICT, MISSING_PARAM } = responses()
    if (!path) return MISSING_PARAM
    const dir = this.configFileDir()
    const filePath = resolve(dir, path)
    if (await exists(filePath)) {
      if (update) {
        await writeFile(filePath, content)
      } else {
        return CONFLICT
      }
    } else {
      await writeFile(filePath, content)
    }
    return SUCCESS
  }

  async trash(path?: string, physics = false) {
    const { NOT_FOUND, SUCCESS, MISSING_PARAM } = responses()
    if (!path) return MISSING_PARAM
    const dir = this.configFileDir()
    const trashDir = resolve(dir, "trash")
    const filePath = resolve(dir, path)
    if (!await exists(filePath)) return NOT_FOUND
    if (physics) {
      ensureDir(filePath)
        .then(async () => await rm(filePath, { recursive: true }))
        .catch(() => rm(filePath))
    } else {
      await move(filePath, resolve(trashDir, path))
    }
    return SUCCESS
  }

  // TODO: may move to file service etc
  async createFolder(dist?: string) {
    const { SUCCESS, CONFLICT, IO_ERROR, MISSING_PARAM } = responses()
    if (!dist) return MISSING_PARAM
    const dir = this.configFileDir()
    const distDir = resolve(dir, dist)
    try {
      if (await pathExists(distDir)) return CONFLICT
      await mkdir(distDir)
    } catch (error) {
      return IO_ERROR
    }
    return SUCCESS
  }

  async loadTemplate(file?: string) {
    const { SUCCESS, IO_ERROR, MISSING_PARAM } = responses()
    if (!file) return MISSING_PARAM
    const dir = this.configFileDir()
    try {
      const fileStr = await readFile(resolve(dir, file), "utf-8")
      return SUCCESS.withData(fileStr)
    } catch (error) {
      return IO_ERROR.withMsg(`${error}`)
    }
  }
}