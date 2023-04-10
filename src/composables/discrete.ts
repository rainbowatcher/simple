export const useDiscreteApi = () => {
  const { message } = createDiscreteApi(["message", "dialog", "notification", "loadingBar"])
  return {
    messager: message,
  }
}