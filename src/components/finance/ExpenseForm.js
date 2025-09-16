import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// =============================================================
// File: src/components/finance/ExpenseForm.tsx
// Add / Edit expense form
// =============================================================
import { useMemo, useState } from 'react';
import { addExpense, formatCents } from '@/db/finance';
export default function ExpenseForm({ group, onSaved }) {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [payerId, setPayerId] = useState(group.memberIds[0] ?? '');
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [notes, setNotes] = useState('');
    const [weights, setWeights] = useState(() => Object.fromEntries(group.memberIds.map((id) => [id, 1])));
    const amountCents = Math.round((parseFloat(amount.replace(',', '.')) || 0) * 100);
    const totalWeight = useMemo(() => Object.values(weights).reduce((a, b) => a + (b || 0), 0) || 1, [weights]);
    const shares = useMemo(() => group.memberIds.map((id) => ({
        id,
        share: Math.round((amountCents * (weights[id] || 0)) / totalWeight),
    })), [amountCents, totalWeight, weights, group.memberIds]);
    async function handleSubmit(e) {
        e.preventDefault();
        if (!title || !amountCents || !payerId)
            return;
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
        });
        setTitle('');
        setAmount('');
        setNotes('');
        onSaved?.();
    }
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 p-4 bg-white rounded-2xl shadow", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [_jsxs("label", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-sm text-gray-500", children: "Titre" }), _jsx("input", { className: "input input-bordered", value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Courses, resto, essence\u2026" })] }), _jsxs("label", { className: "flex flex-col gap-1", children: [_jsxs("span", { className: "text-sm text-gray-500", children: ["Montant (", group.defaultCurrency, ")"] }), _jsx("input", { className: "input input-bordered", inputMode: "decimal", value: amount, onChange: (e) => setAmount(e.target.value), placeholder: "0,00" })] }), _jsxs("label", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-sm text-gray-500", children: "Pay\u00E9 par" }), _jsx("select", { className: "select select-bordered", value: payerId, onChange: (e) => setPayerId(e.target.value), children: group.memberIds.map((id) => (_jsx("option", { value: id, children: id }, id))) })] }), _jsxs("label", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-sm text-gray-500", children: "Date" }), _jsx("input", { type: "date", className: "input input-bordered", value: date, onChange: (e) => setDate(e.target.value) })] })] }), _jsxs("div", { className: "border-t pt-3", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "font-medium", children: "Participants & parts" }), _jsx("button", { type: "button", className: "btn btn-sm", onClick: () => setWeights(Object.fromEntries(group.memberIds.map((id) => [id, 1]))), children: "\u00C9galiser" })] }), _jsx("div", { className: "grid md:grid-cols-2 gap-2", children: group.memberIds.map((id) => (_jsxs("div", { className: "flex items-center justify-between rounded-xl bg-gray-50 p-2", children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-medium", children: id }), _jsxs("div", { className: "text-xs text-gray-500", children: ["Part: ", weights[id] || 0, " \u00B7", ' ', formatCents(shares.find((s) => s.id === id)?.share || 0, group.defaultCurrency)] })] }), _jsx("input", { type: "number", className: "input input-bordered w-24", value: weights[id] || 0, min: 0, step: 1, onChange: (e) => setWeights((w) => ({
                                        ...w,
                                        [id]: Math.max(0, parseInt(e.target.value || '0')),
                                    })) })] }, id))) })] }), _jsxs("label", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-sm text-gray-500", children: "Notes" }), _jsx("textarea", { className: "textarea textarea-bordered", value: notes, onChange: (e) => setNotes(e.target.value), placeholder: "Optionnel" })] }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { className: "btn btn-primary", type: "submit", disabled: !title || !amountCents, children: "Ajouter" }) })] }));
}
