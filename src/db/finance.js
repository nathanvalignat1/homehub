// =============================================================
// File: src/db/finance.ts
// Dexie schema + types + helpers
// =============================================================
import Dexie from 'dexie';
import { nanoid } from 'nanoid';
class FinanceDB extends Dexie {
    constructor() {
        super('homehub_finance');
        this.version(1).stores({
            groups: 'id, name, archived',
            expenses: 'id, groupId, payerId, expenseDate',
        });
    }
}
export const financeDB = new FinanceDB();
// ---- CRUD helpers ----
export async function createGroup(input) {
    const id = input.id ?? nanoid();
    const group = {
        id,
        name: input.name,
        memberIds: input.memberIds,
        defaultCurrency: input.defaultCurrency,
        createdAt: new Date().toISOString(),
        archived: input.archived ?? false,
    };
    await financeDB.groups.put(group);
    return group;
}
export async function listGroups() {
    return financeDB.groups.orderBy('name').toArray();
}
export async function getGroup(id) {
    return financeDB.groups.get(id);
}
export async function addExpense(input) {
    const id = input.id ?? nanoid();
    const e = {
        id,
        groupId: input.groupId,
        title: input.title,
        amountCents: Math.round(input.amountCents),
        currency: input.currency,
        payerId: input.payerId,
        participants: normalizeParticipants(input.participants),
        expenseDate: input.expenseDate,
        createdAt: new Date().toISOString(),
        notes: input.notes,
    };
    await financeDB.expenses.put(e);
    return e;
}
export async function listExpensesByGroup(groupId) {
    return financeDB.expenses
        .where('groupId')
        .equals(groupId)
        .reverse()
        .sortBy('expenseDate');
}
export async function removeExpense(id) {
    return financeDB.expenses.delete(id);
}
export async function updateExpense(id, patch) {
    await financeDB.expenses.update(id, patch);
    const after = await financeDB.expenses.get(id);
    return after;
}
// ---- Core logic: balances & settlements ----
export function computeBalances(group, expenses) {
    // returns map memberId -> netCents (positive means they should receive)
    const members = group.memberIds;
    const net = new Map(members.map((m) => [m, 0]));
    for (const exp of expenses) {
        // Payer advances the amount
        net.set(exp.payerId, (net.get(exp.payerId) ?? 0) + exp.amountCents);
        // Participants owe according to weights
        const totalWeight = exp.participants.reduce((s, p) => s + (p.weight || 0), 0) || 1;
        for (const p of exp.participants) {
            const share = Math.round((exp.amountCents * (p.weight || 0)) / totalWeight);
            net.set(p.memberId, (net.get(p.memberId) ?? 0) - share);
        }
    }
    // round drift correction so the sum is ~0
    const sum = Array.from(net.values()).reduce((a, b) => a + b, 0);
    if (sum !== 0) {
        const first = group.memberIds[0];
        net.set(first, (net.get(first) ?? 0) - sum);
    }
    return net;
}
export function suggestSettlements(group, expenses) {
    const net = computeBalances(group, expenses);
    const creditors = [];
    const debtors = [];
    for (const [id, amount] of net.entries()) {
        if (amount > 0)
            creditors.push({ id, amount });
        else if (amount < 0)
            debtors.push({ id, amount: -amount });
    }
    // Greedy: largest debtor pays largest creditor
    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);
    const transfers = [];
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
        const d = debtors[i];
        const c = creditors[j];
        const pay = Math.min(d.amount, c.amount);
        if (pay > 0)
            transfers.push({ from: d.id, to: c.id, amountCents: Math.round(pay) });
        d.amount -= pay;
        c.amount -= pay;
        if (d.amount === 0)
            i++;
        if (c.amount === 0)
            j++;
    }
    return transfers;
}
// ---- Utils ----
export function normalizeParticipants(parts) {
    // remove zero/negative weights, collapse duplicates, default weight=1
    const acc = new Map();
    for (const p of parts) {
        const w = p.weight ?? 1;
        if (w > 0)
            acc.set(p.memberId, (acc.get(p.memberId) ?? 0) + w);
    }
    const out = Array.from(acc.entries()).map(([memberId, weight]) => ({ memberId, weight }));
    return out.length ? out : [];
}
export function formatCents(amountCents, currency) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amountCents / 100);
}
