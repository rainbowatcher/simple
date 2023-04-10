import type { MaybeRef } from "@vueuse/core"
import * as monaco from "monaco-editor"
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker"
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker"
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker"
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"

self.MonacoEnvironment = {
  getWorker(_: any, label: string) {
    if (label === "json") {
      return new jsonWorker()
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker()
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker()
    }
    if (label === "typescript" || label === "javascript") {
      return new tsWorker()
    }
    return new editorWorker()
  },
}

monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true)

export const useMonacoEditor = (container: MaybeRef<HTMLDivElement | undefined>, options?: monaco.editor.IStandaloneEditorConstructionOptions) => {
  const instance = shallowRef<monaco.editor.IStandaloneCodeEditor>()
  const [isLoading, toggleLoading] = useToggle(true)
  const _options = { minimap: { enabled: false }, ...options }

  const resize = () => {
    setTimeout(() => {
      instance.value?.layout()
    })
  }

  const stop = watch(() => unref(container), () => {
    const _container = unref(container)
    if (!_container) return
    instance.value = monaco.editor.create(_container, _options)
    toggleLoading(false)

    window.addEventListener("resize", resize)
    instance.value.onDidDispose(() => {
      window.removeEventListener("resize", resize)
      stop()
    })
  })

  return {
    instance,
    isLoading,
    resize,
  }
}