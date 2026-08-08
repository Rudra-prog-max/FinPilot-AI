import type { FormEvent } from "react";

interface TransactionFormData {
  title: string;
  amount: string;
  type: string;
  category: string;
}

interface TransactionFormProps {
  form: TransactionFormData;
  editingId: number | null;
  onChange: (field: keyof TransactionFormData, value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

export default function TransactionForm({
  form,
  editingId,
  onChange,
  onSubmit,
  onCancel,
}: TransactionFormProps) {
  return (
    <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">
          {editingId ? "Edit Transaction" : "Add Transaction"}
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          {editingId
            ? "Update the details of your transaction."
            : "Record your income or expenses."}
        </p>
      </div>

      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Title
          </label>

          <input
            type="text"
            placeholder="e.g. Salary, Groceries"
            value={form.title}
            onChange={(e) => onChange("title", e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Amount
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="₹ 0.00"
            value={form.amount}
            onChange={(e) => onChange("amount", e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Category
          </label>

          <input
            type="text"
            placeholder="e.g. Food, Salary, Travel"
            value={form.category}
            onChange={(e) => onChange("category", e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Transaction Type
          </label>

          <select
            value={form.type}
            onChange={(e) => onChange("type", e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div className="flex flex-col gap-3 pt-2 md:col-span-2 md:flex-row md:justify-end">
          {editingId && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-slate-700 px-6 py-3 font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="rounded-xl bg-cyan-600 px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-500"
          >
            {editingId ? "Update Transaction" : "Add Transaction"}
          </button>
        </div>
      </form>
    </div>
  );
}