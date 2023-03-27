import { MaybeRef } from "@vueuse/core"
import { UnwrapRef } from "vue"
import Fuse from "fuse.js"

export const useState = <T>(state: T) => {
  const _state = ref(state)

  const setState = (state: UnwrapRef<T>) => {
    _state.value = state
  }

  return [_state, setState] as const
}

export interface SearchOptions<T> {
  filter?: (item: T) => boolean
  strict?: MaybeRef<boolean>
  fuzzy?: boolean
}

export const useSearch = <T>(
  source: MaybeRef<T[] | undefined>,
  options?: SearchOptions<T>
) => {
  const {
    strict = false,
    fuzzy = false,
    filter = (item: T) => {
      // debugger
      const _keyword = unref(keyword)
      const _strict = unref(strict)
      if (
        typeof item === "string" ||
        typeof item === "number" ||
        typeof item === "boolean"
      ) {
        if (_strict) {
          return String(item).includes(_keyword)
        }
        return String(item)
          .toLocaleLowerCase()
          .includes(_keyword.toLocaleLowerCase())
      } else if (typeof item === "object") {
        // no implement
        return searchObject(item as object)
      } else if (typeof item === "symbol") {
        // no implement
        return false
      }
      return false
    },
  } = options ?? {}
  const keyword = ref("")
  const searchReturn = ref<T[]>() as Ref<T[] | undefined>
  const matchesReturn = ref<(readonly Fuse.FuseResultMatch[] | undefined)[]>()

  // search method for the click or keyboard event
  function search(e?: KeyboardEvent | Event) {
    if (
      // press enter
      (e instanceof KeyboardEvent && e.code === "Enter") ||
      // click search button
      (e instanceof MouseEvent && e.type === "click") ||
      // clear input content
      typeof e === "undefined"
    ) {
      const { result, matches } = doSearch()
      searchReturn.value = result
      matchesReturn.value = matches
    }
  }

  function doSearch() {
    const _source = unref(source)
    // when keyword is empty string
    if (!keyword.value) {
      return {
        result: _source,
      }
    }

    if (fuzzy) {
      const fuseReturn = new Fuse(_source || [], {
        keys: _source?.[0] ? Object.keys(_source[0]) : [],
        isCaseSensitive: unref(strict),
        includeMatches: true,
        includeScore: true,
      }).search(keyword.value)

      return {
        result: fuseReturn.map((i) => i.item),
        matches: fuseReturn.map((i) => i.matches),
      }
    }
    return {
      result: _source?.filter(filter),
    }
  }

  function searchObject(obj: Object): boolean {
    return Object.values(obj).find(filter)
  }

  // when source changed, do search immediately
  watch(
    () => source,
    () => search()
  )

  return {
    result: searchReturn,
    keyword,
    search,
    matches: matchesReturn,
  }
}

export const useType = (status = 10001) =>
  status > 10000 ? "error" : "success"
