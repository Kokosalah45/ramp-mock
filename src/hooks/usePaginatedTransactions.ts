import { useCallback, useState } from "react"
import {
  PaginatedRequestParams,
  PaginatedResponse,
  RequestByEmployeeParams,
  Transaction,
} from "../utils/types"
import { PaginatedTransactionsResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

export function usePaginatedTransactions(): PaginatedTransactionsResult & {
  fetchById: (employeeId: string) => any
  isLastPage: boolean
} {
  const { fetchWithCache, loading } = useCustomFetch()
  const [paginatedTransactions, setPaginatedTransactions] = useState<PaginatedResponse<
    Transaction[]
  > | null>(null)

  const isLastPage = !!paginatedTransactions?.data && !paginatedTransactions.nextPage

  const fetchAll = useCallback(async () => {
    const response = await fetchWithCache<PaginatedResponse<Transaction[]>, PaginatedRequestParams>(
      "paginatedTransactions",
      {
        page: paginatedTransactions === null || isLastPage ? 0 : paginatedTransactions.nextPage,
      }
    )

    setPaginatedTransactions((previousResponse) => {
      if (response === null || previousResponse === null) {
        return response
      }

      return { data: response.data, nextPage: response.nextPage }
    })
  }, [fetchWithCache, paginatedTransactions])

  const fetchById = useCallback(
    async (employeeId: string) => {
      const response = await fetchWithCache<
        PaginatedResponse<Transaction[]>,
        PaginatedRequestParams | RequestByEmployeeParams
      >("paginatedTransactions", {
        page: paginatedTransactions === null ? 0 : paginatedTransactions.nextPage,
        employeeId,
      })

      setPaginatedTransactions((previousResponse) => {
        if (response === null || previousResponse === null) {
          return response
        }

        return { data: response.data, nextPage: response.nextPage }
      })
    },
    [fetchWithCache, paginatedTransactions]
  )

  const invalidateData = useCallback(() => {
    setPaginatedTransactions(null)
  }, [])

  return { data: paginatedTransactions, fetchById, loading, fetchAll, invalidateData, isLastPage }
}
