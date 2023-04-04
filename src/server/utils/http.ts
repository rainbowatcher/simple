import util from "util"
import h3 from "h3"
import useLogger from "./logger"

const logger = useLogger("http")

export type Resp<T = unknown> = Omit<BaseResp<T>, "send" | "withMsg">

class BaseResp<T = unknown> {
  public message: string
  public data?: T
  public status: number

  constructor(message: string, status: number, data?: T) {
    this.message = message
    this.status = status
    this.data = data
  }

  async send(e: h3.H3Event, data?: T, msg?: string) {
    this.data = data ?? this.data
    this.message = msg ?? this.message
    const logMessage = `Send Message: ${this.message}`
    this.status > 10000 ? logger.warn(logMessage) : logger.debug(logMessage)
    await h3.send(e, JSON.stringify(this), "json")
  }

  withMsg(msg: string, ...args: unknown[]) {
    this.message = args ? util.format(msg, ...args) : msg
    return this
  }

  withData(data: T) {
    this.data = data
    return this
  }
}

export async function parseRequest<T = undefined>(e: h3.H3Event) {
  const method = h3.getMethod(e)
  const url = h3.getRequestURL(e)
  const { pathname } = url
  const { search } = url
  logger.info("Received %s: %s", method, pathname + search)

  const headers = h3.getHeaders(e)
  logger.debug("Request headers: %s", headers)

  const body = method === "GET" ? undefined : await h3.readBody<T>(e)
  if (body) logger.info("Request body: %s", JSON.stringify(body, null, 2))

  return {
    url,
    body,
  }
}

export function responses<T = unknown>() {
  const SUCCESS = new BaseResp<T>("Success", 10000)
  const MISSING_PARAM = new BaseResp<T>("Missing request param", 10001)
  const INVALID_PARAM = new BaseResp<T>("Invalid request param", 10002)
  const NOT_FOUND = new BaseResp<T>("Resource not found", 10004)
  const CONFLICT = new BaseResp<T>("Resource already exists", 10005)
  const IO_ERROR = new BaseResp<T>("Resource already exists", 11005)

  return {
    SUCCESS,
    MISSING_PARAM,
    INVALID_PARAM,
    NOT_FOUND,
    CONFLICT,
    IO_ERROR,
  }
}
