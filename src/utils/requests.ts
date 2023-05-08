import {
  PaginatedRequestParams,
  PaginatedResponse,
  RequestByEmployeeParams,
  SetTransactionApprovalParams,
  Transaction,
  Employee,
} from "./types"
import mockData from "../mock-data.json"

const TRANSACTIONS_PER_PAGE = 4 // bring back to 5 dont forget

const data: { employees: Employee[]; transactions: Transaction[] } = {
  employees: mockData.employees,
  transactions: mockData.transactions,
}

export const getEmployees = (): Employee[] => data.employees

export const getTransactionsPaginated = ({
  page,
  employeeId,
}: PaginatedRequestParams): PaginatedResponse<Transaction[]> => {
  //console.log({ employeeId })

  if (page === null) {
    throw new Error("Page cannot be null")
  }

  const start = page * TRANSACTIONS_PER_PAGE
  const end = start + TRANSACTIONS_PER_PAGE
  let transactionData =
    employeeId.length !== 0 ? getTransactionsByEmployee({ employeeId }) : data.transactions

  if (start > transactionData.length) {
    throw new Error(`Invalid page ${page}`)
  }

  let nextPage = end < transactionData.length ? page + 1 : null
  //console.log({ transactionData })

  return {
    totalSize: transactionData.length,
    nextPage,
    data: transactionData.slice(start, end),
    pageSize: TRANSACTIONS_PER_PAGE,
  }
}

export const getTransactionsByEmployee = ({ employeeId }: RequestByEmployeeParams) => {
  if (!employeeId) {
    throw new Error("Employee id cannot be empty")
  }

  return data.transactions.filter((transaction) => transaction.employee.id === employeeId)
}

export const setTransactionApproval = ({ transactionId, value }: SetTransactionApprovalParams): void => {
  const transaction = data.transactions.find(
    (currentTransaction) => currentTransaction.id === transactionId
  )

  if (!transaction) {
    throw new Error("Invalid transaction to approve")
  }

  transaction.approved = value
}
