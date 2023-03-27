import consola, {
  BasicReporter,
  FancyReporter,
  ConsolaReporterArgs,
  ConsolaReporterLogObject,
  BasicReporterOptions,
LogLevel,
} from "consola"
import { getLogDir, projectName } from "../utils/path"
import * as fs from "fs-extra"
import path from "node:path"
import { formatDate } from "@vueuse/core"
import util from "node:util"
import { PathLike } from "node:fs"
import mri from "mri"

interface FileReporterOptions extends BasicReporterOptions {
  path: PathLike
}

class FileReporter extends BasicReporter {
  constructor(opts: FileReporterOptions) {
    super(
      Object.assign(
        {
          dateFormat: "YYYY-MM-DD HH:mm:ss",
        },
        opts
      )
    )
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
      msgStr
    )

    // @ts-expect-error type
    const stream = fs.createWriteStream(this.options.path, {
      encoding: "utf-8",
      flags: "a",
    })
    super.log(
      { ...logObj, args: [line], date: new Date(), level: LogLevel.Info },
      { async, stderr: stream, stdout: stream }
    )
  }
}

export const getLogFilePath = () => {
  const today = formatDate(new Date(), "YYYY-MM-DD")
  const logDir = getLogDir()
  const logFileName = `simple-${today}.log`
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
      tag: projectName
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
