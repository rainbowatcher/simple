import type { MaybeRef } from "@vueuse/core"
import type { UnwrapRef } from "vue"
import Fuse from "fuse.js"

export function useState<T>(state: T) {
  const stateRef = ref(state)

  const setState = (state: UnwrapRef<T>) => {
    stateRef.value = state
  }

  return [stateRef, setState] as const
}

export type SearchOptions<T> = {
  filter?: (item: T) => boolean
  isStrict?: MaybeRef<boolean>
  shouldFuzzy?: boolean
}

export function useSearch<T>(source: MaybeRef<T[] | undefined>, options?: SearchOptions<T>) {
  const {
    isStrict = false,
    shouldFuzzy = false,
    filter = (item: T) => {
      const keywordValue = unref(keyword)
      const isStrictValue = unref(isStrict)
      if (
        typeof item === "string" ||
        typeof item === "number" ||
        typeof item === "boolean"
      ) {
        if (isStrictValue) {
          return String(item).includes(keywordValue)
        }
        return String(item)
          .toLocaleLowerCase()
          .includes(keywordValue.toLocaleLowerCase())
      }
      else if (typeof item === "object") {
        // no implement
        return searchObject(item as Record<string, unknown>)
      }
      else if (typeof item === "symbol") {
        // no implement
        return false
      }
      return false
    },
  } = options ?? {}
  const keyword = ref("")
  const searchReturn = ref<T[]>()
  const matchesReturn = ref<Array<readonly Fuse.FuseResultMatch[] | undefined>>()

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
    const sourceValue = unref(source)
    // when keyword is empty string
    if (!keyword.value) {
      return {
        result: sourceValue,
      }
    }

    if (shouldFuzzy) {
      const fuseReturn = new Fuse(sourceValue || [], {
        keys: sourceValue?.[0] ? Object.keys(sourceValue[0]) : [],
        isCaseSensitive: unref(isStrict),
        includeMatches: true,
        includeScore: true,
      }).search(keyword.value)

      return {
        result: fuseReturn.map(i => i.item),
        matches: fuseReturn.map(i => i.matches),
      }
    }
    return {
      result: sourceValue?.filter(filter),
    }
  }

  function searchObject(obj: Record<string, unknown>): boolean {
    return !!Object.values(obj).find(filter as (value: unknown, i: number, o: unknown[]) => boolean) || false
  }

  // when source changed, do search immediately
  watch(
    () => source,
    () => { search() },
  )

  return {
    result: searchReturn,
    keyword,
    search,
    matches: matchesReturn,
  }
}

export function useType(status = 10001) {
  return status > 10000 ? "error" : "success"
}
