// =============================================================
// File: src/tests/finance.spec.ts
// Vitest tests for balances + settlement
// =============================================================
import { describe, it, expect } from 'vitest'
import {
  computeBalances,
  suggestSettlements,
  type FinanceGroup,
  type Expense,
} from '@/db/finance'

const group: FinanceGroup = {
  id: 'g1',
  name: 'Trip',
  memberIds: ['Alice', 'Bob', 'Chloé'],
  defaultCurrency: 'EUR',
  createdAt: new Date().toISOString(),
}

const mkExpense = (e: Partial<Expense>): Expense => ({
  id: e.id ?? 'e' + Math.random(),
  groupId: group.id,
  title: e.title ?? 'x',
  amountCents: e.amountCents ?? 0,
  currency: 'EUR',
  payerId: e.payerId ?? 'Alice',
  participants: e.participants ?? group.memberIds.map((id) => ({ memberId: id, weight: 1 })),
  createdAt: new Date().toISOString(),
  expenseDate: new Date().toISOString(),
})

describe('balances', () => {
  it('equal split simple', () => {
    const expenses: Expense[] = [
      mkExpense({ title: 'Hotel', amountCents: 9000, payerId: 'Alice' }),
      mkExpense({ title: 'Train', amountCents: 6000, payerId: 'Bob' }),
    ]
    const net = computeBalances(group, expenses)
    expect(net.get('Alice')).toBe(9000 - 5000)
    expect(net.get('Bob')).toBe(6000 - 5000)
    expect(net.get('Chloé')).toBe(0 - 5000)
  })

  it('weighted split', () => {
    const expenses: Expense[] = [
      mkExpense({
        title: 'Airbnb',
        amountCents: 12000,
        payerId: 'Alice',
        participants: [
          { memberId: 'Alice', weight: 1 },
          { memberId: 'Bob', weight: 2 },
          { memberId: 'Chloé', weight: 1 },
        ],
      }),
    ]
    const net = computeBalances(group, expenses)
    // weights sum = 4, shares = 3000 / 6000 / 3000
    expect(net.get('Alice')).toBe(12000 - 3000)
    expect(net.get('Bob')).toBe(0 - 6000)
    expect(net.get('Chloé')).toBe(0 - 3000)
  })
})

describe('settlements', () => {
  it('produces minimal transfers (greedy)', () => {
    const expenses: Expense[] = [
      mkExpense({ amountCents: 9000, payerId: 'Alice' }),
      mkExpense({ amountCents: 6000, payerId: 'Bob' }),
    ]
    const transfers = suggestSettlements(group, expenses)
    const total = transfers.reduce((s, t) => s + t.amountCents, 0)
    // Ici on vérifie qu'on règle la dette totale
    expect(total).toBe(5000)
  })
})
