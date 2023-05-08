import { useCallback, useState } from "react"
import {
  PaginatedRequestParams,
  PaginatedResponse,
  RequestByEmployeeParams,
  Transaction,
} from "../utils/types"
import { PaginatedTransactionsResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

export function usePaginatedTransactions(): Omit<PaginatedTransactionsResult, "fetchAll"> & {
  isLastPage: boolean
  isLessThanPageSize: boolean
  currentResourceId: string
} {
  const { fetchWithCache, loading } = useCustomFetch()
  const [paginatedTransactions, setPaginatedTransactions] = useState<PaginatedResponse<
    Transaction[]
  > | null>(null)
  //console.log({ paginatedTransactions })

  const [currentResourceId, setCurrentResourceId] = useState<string>("")

  const isLastPage = !!paginatedTransactions?.data && !paginatedTransactions.nextPage

  const isLessThanPageSize =
    paginatedTransactions !== null && paginatedTransactions.totalSize < paginatedTransactions.pageSize

  const fetchNew = useCallback(
    async (employeeId: string) => {
      const response = await fetchWithCache<PaginatedResponse<Transaction[]>, PaginatedRequestParams>(
        "paginatedTransactions",
        {
          page: 0,
          employeeId,
        }
      )

      setPaginatedTransactions((previousResponse) => {
        if (response === null || previousResponse === null) {
          setCurrentResourceId(employeeId)
          return response
        }
        setCurrentResourceId(employeeId)
        return {
          data: response.data,
          nextPage: response.nextPage,
          pageSize: response.pageSize,
          totalSize: response.pageSize,
        }
      })
    },
    [fetchWithCache, paginatedTransactions, isLastPage]
  )

  const fetchNext = useCallback(async () => {
    const response = await fetchWithCache<
      PaginatedResponse<Transaction[]>,
      PaginatedRequestParams | RequestByEmployeeParams
    >("paginatedTransactions", {
      page: paginatedTransactions === null || isLastPage ? 0 : paginatedTransactions.nextPage,
      employeeId: currentResourceId,
    })
    setPaginatedTransactions((previousResponse) => {
      if (response === null || previousResponse === null) {
        return response
      }
      return {
        data: response.data,
        nextPage: response.nextPage,
        pageSize: response.pageSize,
        totalSize: response.pageSize,
      }
    })
  }, [currentResourceId, fetchWithCache, isLastPage, paginatedTransactions])

  const invalidateData = useCallback(() => {
    setPaginatedTransactions(null)
  }, [])

  return {
    fetchNew,
    fetchNext,
    invalidateData,
    data: paginatedTransactions,
    loading,
    isLastPage,
    isLessThanPageSize,
    currentResourceId,
  }
}
