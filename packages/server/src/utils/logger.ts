import { resolve } from "node:path"
import { format } from "node:util"
import { createStream } from "rotating-file-stream"
import { createConsola } from "consola"
import type { ConsolaReporter } from "consola"
import { getLogDir } from "./path"

const logFilePath = resolve(getLogDir(), "simple.log")
const stream = createStream(
  logFilePath, {
    size: "10M",
  },
)

const fileReporter: ConsolaReporter = {
  log: (label, _ctx) => {
    const { date, type, tag } = label
    const formatted = formatDate(date)
    const level = type.toUpperCase().padEnd(5, " ")
    const tagStr = tag ? ` ${tag}` : ""
    stream.write(`${formatted} [${level}]${tagStr}: ${format(label.args[0], ...(label.args as string[]).slice(1))}\n`)
  },
}

const fancyReporter: ConsolaReporter = {
  log: (label, _ctx) => {
    const { date, type, tag } = label
    const formatted = formatDate(date)
    const level = type.toUpperCase().padEnd(5, " ")
    const tagStr = tag ? ` ${tag}` : ""
    process.stdout.write(`${formatted} [${level}]${tagStr}: ${format(label.args[0], ...(label.args as string[]).slice(1))}\n`)
  },
}

function formatDate(date: Date) {
  const year = date.getUTCFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  const hour = `${date.getHours()}`.padStart(2, "0")
  const min = `${date.getUTCMinutes()}`.padStart(2, "0")
  const seconds = `${date.getUTCSeconds()}`.padStart(2, "0")
  const formatted = `${year}-${month}-${day} ${hour}:${min}:${seconds}`
  return formatted
}

const consola = createConsola({
  reporters: [fileReporter, fancyReporter],
})

export const getLogger = (tag: string) => consola.withTag(tag)

