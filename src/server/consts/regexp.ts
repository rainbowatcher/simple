import {
  anyOf,
  charIn,
  digit,
  exactly,
  letter,
  oneOrMore,
  word,
  wordChar,
} from "magic-regexp"

// export const ipv4PartRE = digit.times.between(1, 3)
export const ipv4PartRE = exactly("25")
  .and(charIn("012345"))
  .or(exactly("2").and(charIn("01234")).and(digit))
  .or(charIn("01").optionally().and(digit.and(digit.optionally())))
export const ipv4AddrRE = exactly("")
  .at.lineStart()
  .and(ipv4PartRE.and(".").times(3).and(ipv4PartRE).at.lineEnd())
export const domainRE = letter
  .or(digit)
  .at.lineStart()
  .and(oneOrMore(wordChar.or("-").times.atMost(61).and(wordChar).and(".")))
  .and(letter.times.atLeast(2))
  .at.lineEnd()
export const hostRE = domainRE.or(ipv4AddrRE).as("host")
export const portRE = digit.times.between(1, 5).as("port")
export const dbRE = word.as("database")
export const connectStringRE = hostRE.and(":").and(portRE).and("/").and(dbRE)

// (?:[a-zA-Z]|\d)(?:(?:\w|-){0,61}\w\.)+\w+
// (?:[a-zA-Z]|\d)(?:(?:\w|-){0,61}\w\.)+(?:[a-zA-Z]){2,}
// (?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)
// (?:(?:25[012345]|2[01234]\d)|(?:(?:[01])?(?:\d\d)?\.){3})
// (?:(?:25[012345]|2[01234]\d)|(?:(?:[01])?\d\d?\.){3})
// (?:(?:25[012345]|2[01234]\d)|(?:[01])?\d\d?)
// (?:(?:25[012345]|2[01234]\d)|(?:[01])?\d\d?)\.
// (?:(?:(?:25[012345]|2[01234]\d)|(?:[01])?\d\d?)\.){3}(?:(?:25[012345]|2[01234]\d)|(?:[01])?\d\d?)
// (?<host>^(?:[a-zA-Z]|\d)(?:(?:\w|-){0,61}\w\.)+(?:[a-zA-Z]){2,}$|(?:(?:(?:25[012345]|2[01234]\d)|(?:[01])?\d\d?)\.){3}(?:(?:25[012345]|2[01234]\d)|(?:[01])?\d\d?)$)
// (?:^(?:(?:25[012345]|2[01234]\d)|(?:[01])?\d\d?)\.){3}^(?:(?:25[012345]|2[01234]\d)|(?:[01])?\d\d?)$
// (?:(?:(?:^25[012345]|^2[01234]\d)|(?:^[01])?\d\d?)\.){3}(?:(?:^25[012345]|^2[01234]\d)|(?:^[01])?\d\d?)$
// (?:^(?:(?:25[012345]|2[01234]\d)|(?:[01])?\d\d?)\.){3}(?:(?:25[012345]|2[01234]\d)|(?:[01])?\d\d?)$
// (?<host>^(?:[a-zA-Z]|\d)(?:(?:\w|-){0,61}\w\.)+(?:[a-zA-Z]){2,}$|^(?:(?:(?:25[012345]|2[01234]\d)|(?:[01])?\d\d?)\.){3}(?:(?:25[012345]|2[01234]\d)|(?:[01])?\d\d?)$)

// 11.22.33.33
// kafka01.juneyao.com
// kafk$a01.juneyao.com
// kafk^a01.juneyao.com
// 11.22
// 123.com
// hao123.com
// w3.hao123.com
// wwww.hao123.com
// com.123
// xxx.x22
// xx2.x23
// xx2.x23
// 123.xx2.x23
// 123.xx2.xc
// 123-.xx-2.xc
// 12-3.xx-2.xc
// -12-3.xx-2.xc
// 12_3.xx-2.xc
// 12-3.xx-.xc
// 12-3.xx-.-xc
// 12--.xx-.-xc
// 12--.-xx-.-xc
// 12-3.-xx-.-xc
// 255.1.12.123
// 253.90.12.123
// 253.190.12.123
// 253.190.12.123
// 256.190.12.123
// 256.0.0.1
// 256.0-.0.1
// 2560.0.0.1
// 2560.0.0.12x
// 256e0.0.0.12x
