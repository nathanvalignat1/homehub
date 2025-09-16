import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// =============================================================
// File: src/components/finance/ExpenseList.tsx
// =============================================================
import { formatCents } from "@/db/finance";
export default function ExpenseList({ items, currency, onDelete, }) {
    if (!items.length)
        return _jsx("div", { className: "text-gray-500", children: "Aucune d\u00E9pense pour le moment." });
    return (_jsx("ul", { className: "divide-y rounded-2xl bg-white shadow", children: items.map((e) => (_jsxs("li", { className: "p-3 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: e.title }), _jsxs("div", { className: "text-xs text-gray-500", children: [new Date(e.expenseDate).toLocaleDateString("fr-FR"), " \u2022 pay\u00E9 par", " ", e.payerId] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "font-semibold", children: formatCents(e.amountCents, e.currency) }), onDelete && (_jsx("button", { className: "btn btn-ghost btn-sm", onClick: () => onDelete(e.id), children: "Supprimer" }))] })] }, e.id))) }));
}
