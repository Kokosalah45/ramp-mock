export type Transaction = {
  id: string
  amount: number
  employee: Employee
  merchant: string
  date: string
  approved: boolean
}

export type GenericObject = {
  [k: string | number]: any
}

export type Employee = {
  id: string
  firstName: string
  lastName: string
}

export type PaginatedResponse<TData> = {
  data: TData
  nextPage: number | null
  pageSize: number
  totalSize: number
}

export type PaginatedRequestParams = {
  page: number | null
  employeeId: string
}

export type RequestByEmployeeParams = {
  employeeId: string
}

export type SetTransactionApprovalParams = {
  transactionId: string
  value: boolean
}
