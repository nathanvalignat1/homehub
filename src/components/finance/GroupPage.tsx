// =============================================================
// File: src/pages/finance/GroupPage.tsx
// Page tying everything together (router-agnostic)
// =============================================================

import { removeExpense, formatCents } from '@/db/finance'
import { useBalances } from '@/hooks/useFinance'
import ExpenseForm from '@/components/finance/ExpenseForm'
import ExpenseList from '@/components/finance/ExpenseList'

export default function GroupPage({ groupId }: { groupId: string }) {
  const { group, expenses, balances, settlements } = useBalances(groupId)
  if (!group) return <div>Groupe introuvable.</div>

  const currency = group.defaultCurrency

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{group.name}</h1>
      </header>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white shadow p-3">
          <h2 className="font-semibold mb-2">Soldes</h2>
          <ul className="grid sm:grid-cols-2 gap-2">
            {group.memberIds.map((id) => {
              const v = balances.get(id) || 0
              return (
                <li key={id} className={`rounded-xl p-3 ${v >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="text-sm text-gray-500">{id}</div>
                  <div className="text-lg font-semibold">{formatCents(v, currency)}</div>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="rounded-2xl bg-white shadow p-3">
          <h2 className="font-semibold mb-2">Règlements suggérés</h2>
          {settlements.length === 0 ? (
            <div className="text-gray-500">Rien à régler.</div>
          ) : (
            <ul className="space-y-2">
              {settlements.map((t, i) => (
                <li key={i} className="rounded-xl p-3 bg-gray-50">
                  <span className="font-medium">{t.from}</span> →{' '}
                  <span className="font-medium">{t.to}</span>
                  <span className="ml-2">{formatCents(t.amountCents, currency)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-2">Ajouter une dépense</h2>
        <ExpenseForm group={group} />
      </section>

      <section>
        <h2 className="font-semibold mb-2">Historique</h2>
        <ExpenseList items={expenses} currency={currency} onDelete={removeExpense} />
      </section>
    </div>
  )
}