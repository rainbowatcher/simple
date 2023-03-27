import h3 from "h3"
import useLogger from "./logger"
import util from "util"

const logger = useLogger("http")

export type Resp<T = any> = Omit<BaseResp<T>, "send" | "withMsg">

class BaseResp<T = any> {
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

  withMsg(msg: string, ...args: any[]) {
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
  const pathname = url.pathname
  const search = url.search
  logger.info("Received %s: %s", method, pathname + search)

  const headers = h3.getHeaders(e)
  logger.debug("Request headers: %s", headers)

  let body = method === "GET" ? undefined : await h3.readBody<T>(e)
  if (body) logger.info("Request body: %s", JSON.stringify(body, null, 2))

  return {
    url,
    body,
  }
}

export const Responses = {
  SUCCESS: new BaseResp("Success", 10000),
  MISSING_PARAM: new BaseResp("Missing request param", 10001),
  INVALID_PARAM: new BaseResp("Invalid request param", 10001),
  NOT_FOUND: new BaseResp("Resource not found", 10004),
  CONFLICT: new BaseResp("Resource already exists", 10005),
}
