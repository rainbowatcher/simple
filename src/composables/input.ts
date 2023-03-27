export const useAllowInteger = (input: string) => {
  return !input || /^\d+$/.test(input)
}

export const useNotAllowWhiteSpace = (input: string) => {
  return !input || !input.includes(" ")
}
