import { eventHandler, Router } from "h3"

export default setupRouter

function setupRouter(router: Router) {
  router.get(
    "/user",
    eventHandler((e) => {
      return "this is user"
    })
  )
  router.get(
    "/",
    eventHandler((e) => `get req: ${e.path}`)
  )
  router.post(
    "/",
    eventHandler((e) => `post req: ${e.path}`)
  )
}
