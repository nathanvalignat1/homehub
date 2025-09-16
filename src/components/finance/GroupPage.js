import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// =============================================================
// File: src/pages/finance/GroupPage.tsx
// Page tying everything together (router-agnostic)
// =============================================================
import { removeExpense, formatCents } from '@/db/finance';
import { useBalances } from '@/hooks/useFinance';
import ExpenseForm from '@/components/finance/ExpenseForm';
import ExpenseList from '@/components/finance/ExpenseList';
export default function GroupPage({ groupId }) {
    const { group, expenses, balances, settlements } = useBalances(groupId);
    if (!group)
        return _jsx("div", { children: "Groupe introuvable." });
    const currency = group.defaultCurrency;
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("header", { className: "flex items-center justify-between", children: _jsx("h1", { className: "text-2xl font-bold", children: group.name }) }), _jsxs("section", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "rounded-2xl bg-white shadow p-3", children: [_jsx("h2", { className: "font-semibold mb-2", children: "Soldes" }), _jsx("ul", { className: "grid sm:grid-cols-2 gap-2", children: group.memberIds.map((id) => {
                                    const v = balances.get(id) || 0;
                                    return (_jsxs("li", { className: `rounded-xl p-3 ${v >= 0 ? 'bg-green-50' : 'bg-red-50'}`, children: [_jsx("div", { className: "text-sm text-gray-500", children: id }), _jsx("div", { className: "text-lg font-semibold", children: formatCents(v, currency) })] }, id));
                                }) })] }), _jsxs("div", { className: "rounded-2xl bg-white shadow p-3", children: [_jsx("h2", { className: "font-semibold mb-2", children: "R\u00E8glements sugg\u00E9r\u00E9s" }), settlements.length === 0 ? (_jsx("div", { className: "text-gray-500", children: "Rien \u00E0 r\u00E9gler." })) : (_jsx("ul", { className: "space-y-2", children: settlements.map((t, i) => (_jsxs("li", { className: "rounded-xl p-3 bg-gray-50", children: [_jsx("span", { className: "font-medium", children: t.from }), " \u2192", ' ', _jsx("span", { className: "font-medium", children: t.to }), _jsx("span", { className: "ml-2", children: formatCents(t.amountCents, currency) })] }, i))) }))] })] }), _jsxs("section", { children: [_jsx("h2", { className: "font-semibold mb-2", children: "Ajouter une d\u00E9pense" }), _jsx(ExpenseForm, { group: group })] }), _jsxs("section", { children: [_jsx("h2", { className: "font-semibold mb-2", children: "Historique" }), _jsx(ExpenseList, { items: expenses, currency: currency, onDelete: removeExpense })] })] }));
}
