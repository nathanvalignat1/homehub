// =============================================================
// File: src/components/finance/ExpenseForm.tsx
// Add / Edit expense form
// =============================================================
import { useMemo, useState, type FormEvent } from 'react'
import { addExpense, type FinanceGroup, formatCents } from '@/db/finance'

interface Props {
  group: FinanceGroup
  onSaved?: () => void
}

export default function ExpenseForm({ group, onSaved }: Props) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [payerId, setPayerId] = useState(group.memberIds[0] ?? '')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState('')
  const [weights, setWeights] = useState<Record<string, number>>(() =>
    Object.fromEntries(group.memberIds.map((id) => [id, 1])),
  )

  const amountCents = Math.round((parseFloat(amount.replace(',', '.')) || 0) * 100)
  const totalWeight = useMemo(
    () => Object.values(weights).reduce((a, b) => a + (b || 0), 0) || 1,
    [weights],
  )
  const shares = useMemo(
    () =>
      group.memberIds.map((id) => ({
        id,
        share: Math.round((amountCents * (weights[id] || 0)) / totalWeight),
      })),
    [amountCents, totalWeight, weights, group.memberIds],
  )

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title || !amountCents || !payerId) return
    await addExpense({
      groupId: group.id,
      title,
      amountCents,
      currency: group.defaultCurrency,
      payerId,
      participants: group.memberIds.map((id) => ({
        memberId: id,
        weight: weights[id] || 0,
      })),
      expenseDate: new Date(date).toISOString(),
      notes,
    })
    setTitle('')
    setAmount('')
    setNotes('')
    onSaved?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-2xl shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-500">Titre</span>
          <input
            className="input input-bordered"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Courses, resto, essence…"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-500">
            Montant ({group.defaultCurrency})
          </span>
          <input
            className="input input-bordered"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0,00"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-500">Payé par</span>
          <select
            className="select select-bordered"
            value={payerId}
            onChange={(e) => setPayerId(e.target.value)}
          >
            {group.memberIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-500">Date</span>
          <input
            type="date"
            className="input input-bordered"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
      </div>

      <div className="border-t pt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Participants & parts</span>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() =>
              setWeights(Object.fromEntries(group.memberIds.map((id) => [id, 1])))
            }
          >
            Égaliser
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-2">
          {group.memberIds.map((id) => (
            <div key={id} className="flex items-center justify-between rounded-xl bg-gray-50 p-2">
              <div className="flex-1">
                <div className="font-medium">{id}</div>
                <div className="text-xs text-gray-500">
                  Part: {weights[id] || 0} ·{' '}
                  {formatCents(shares.find((s) => s.id === id)?.share || 0, group.defaultCurrency)}
                </div>
              </div>
              <input
                type="number"
                className="input input-bordered w-24"
                value={weights[id] || 0}
                min={0}
                step={1}
                onChange={(e) =>
                  setWeights((w) => ({
                    ...w,
                    [id]: Math.max(0, parseInt(e.target.value || '0')),
                  }))
                }
              />
            </div>
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-gray-500">Notes</span>
        <textarea
          className="textarea textarea-bordered"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optionnel"
        />
      </label>

      <div className="flex justify-end">
        <button className="btn btn-primary" type="submit" disabled={!title || !amountCents}>
          Ajouter
        </button>
      </div>
    </form>
  )
}
