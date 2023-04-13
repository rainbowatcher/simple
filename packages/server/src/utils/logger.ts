import path from "node:path"
import util from "node:util"
import type { PathLike } from "node:fs"
import * as fs from "fs-extra"
import type {
  BasicReporterOptions,
  ConsolaReporterArgs,
  ConsolaReporterLogObject,
} from "consola"
import consola, {
  BasicReporter,
  FancyReporter,
  LogLevel,
} from "consola"
import mri from "mri"
import { getLogDir, projectName } from "../utils/path"

type FileReporterOptions = {
  path: PathLike
} & BasicReporterOptions

class FileReporter extends BasicReporter {
  path: PathLike
  constructor(opts: FileReporterOptions) {
    super(
      Object.assign(
        {
          dateFormat: "YYYY-MM-DD HH:mm:ss",
        },
        opts,
      ),
    )
    this.path = opts.path
  }

  formatLogObj(logObj: ConsolaReporterLogObject) {
    return this.formatArgs(logObj.args)
  }

  log(logObj: ConsolaReporterLogObject, { async }: ConsolaReporterArgs) {
    const dateStr = this.formatDate(logObj.date)
    const logLevelStr = logObj.type.toUpperCase().padEnd(7, " ")
    const msgStr = this.formatArgs(logObj.args)
    const line = util.format(
      "%s [%s] %s - %s",
      dateStr,
      logLevelStr,
      logObj.tag,
      msgStr,
    )

    const stream = fs.createWriteStream(this.path, {
      encoding: "utf-8",
      flags: "a",
    })
    super.log(
      { ...logObj, args: [line], date: new Date(), level: LogLevel.Info },
      { async, stderr: stream, stdout: stream },
    )
  }
}

export const getLogFilePath = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")
  const todayStr = `${year}-${month}-${day}`
  const logDir = getLogDir()
  const logFileName = `simple-${todayStr}.log`
  return path.resolve(logDir, logFileName)
}

function initLogger() {
  const logFilePath = getLogFilePath()
  const exists = fs.existsSync(logFilePath)
  if (!exists) fs.createFileSync(logFilePath)
  const fileRp = new FileReporter({ path: getLogFilePath() })
  const fancyRp = new FancyReporter()

  const { debug } = mri(process.argv.slice(2))
  return consola.create({
    defaults: {
      tag: projectName,
    },
    level: debug ? LogLevel.Debug : LogLevel.Info,
    async: true,
    reporters: [fileRp, fancyRp],
  })
}

const logger = initLogger()

export default function useLogger(scope?: string) {
  return scope ? logger.withScope(scope) : logger
}
