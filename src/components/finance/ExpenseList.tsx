// =============================================================
// File: src/components/finance/ExpenseList.tsx
// =============================================================
import { type Expense, type CurrencyCode, formatCents } from "@/db/finance";

export default function ExpenseList({
  items,
  currency,
  onDelete,
}: {
  items: Expense[];
  currency: CurrencyCode;
  onDelete?: (id: string) => void;
}) {
  if (!items.length)
    return <div className="text-gray-500">Aucune dépense pour le moment.</div>;
  return (
    <ul className="divide-y rounded-2xl bg-white shadow">
      {items.map((e) => (
        <li key={e.id} className="p-3 flex items-center justify-between">
          <div>
            <div className="font-medium">{e.title}</div>
            <div className="text-xs text-gray-500">
              {new Date(e.expenseDate).toLocaleDateString("fr-FR")} • payé par{" "}
              {e.payerId}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="font-semibold">
              {formatCents(e.amountCents, e.currency)}
            </div>
            {onDelete && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => onDelete(e.id)}
              >
                Supprimer
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
