// =============================================================
// File: src/hooks/useFinance.ts
// React hooks to query Dexie and compute derived data
// =============================================================
import { useLiveQuery } from 'dexie-react-hooks'
import {
  listGroups,
  getGroup,
  listExpensesByGroup,
  computeBalances,
  suggestSettlements,
} from '@/db/finance'

export function useGroups() {
  const groups = useLiveQuery(() => listGroups(), [])
  return groups ?? []
}

export function useGroup(groupId: string) {
  const group = useLiveQuery(() => getGroup(groupId), [groupId])
  const expenses = useLiveQuery(() => listExpensesByGroup(groupId), [groupId])
  return { group, expenses: expenses ?? [] }
}

export function useBalances(groupId: string) {
  const { group, expenses } = useGroup(groupId)
  const balances = group ? computeBalances(group, expenses) : new Map()
  const settlements = group ? suggestSettlements(group, expenses) : []
  return { group, expenses, balances, settlements }
}
