export type TableInfo = {
  catalog: string
  schema: string
  comment: string
}

export type FieldInfo = {
  name: string
  type: DataType
  comment?: string
  isPrimary?: boolean
}

export type DataType = {
  name: string
  maxLength: number
  numericPrecision?: number
  numericScale?: number
  unsigned?: boolean
}
