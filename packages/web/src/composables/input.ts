export function useAllowInteger(input: string) {
  return !input || /^\d+$/.test(input)
}

export function useNotAllowWhiteSpace(input: string) {
  return !input || !input.includes(" ")
}
