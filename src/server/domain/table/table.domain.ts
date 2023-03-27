export interface TableInfo {
  catalog: string
  schema: string
  comment: string
}

export interface FieldInfo {
  name: string
  type: DataType
  comment?: string
  isPrimary?: boolean
}

export interface DataType {
  name: string
  maxLength: number
  numericPrecision?: number
  numericScale?: number
  unsigned?: boolean
}
// #endregion
