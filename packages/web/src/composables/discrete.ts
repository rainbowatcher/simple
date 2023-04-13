import type { ConfigProviderProps } from "naive-ui"
import { darkTheme } from "naive-ui"


const configProviderPropsRef = computed<ConfigProviderProps>(() => ({
  theme: useDark().value === false ? undefined : darkTheme,
}))

export const useDiscreteApi = () => {
  const { message } = createDiscreteApi(["message", "dialog", "notification", "loadingBar"], {
    configProviderProps: configProviderPropsRef,
  })
  return {
    messager: message,
  }
}