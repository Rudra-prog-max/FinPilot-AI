interface SummaryCardsProps {
  income: number;
  expense: number;
  balance: number;
}

export default function SummaryCards({
  income,
  expense,
  balance,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="rounded-2xl border border-green-500/20 bg-slate-900/80 p-6 shadow-lg shadow-green-500/5">
        <p className="text-sm font-medium text-slate-400">
          Total Income
        </p>

        <h2 className="mt-2 text-3xl font-bold text-green-400">
          ₹{income.toLocaleString("en-IN")}
        </h2>

        <p className="mt-2 text-xs text-slate-500">
          Money received
        </p>
      </div>

      <div className="rounded-2xl border border-red-500/20 bg-slate-900/80 p-6 shadow-lg shadow-red-500/5">
        <p className="text-sm font-medium text-slate-400">
          Total Expenses
        </p>

        <h2 className="mt-2 text-3xl font-bold text-red-400">
          ₹{expense.toLocaleString("en-IN")}
        </h2>

        <p className="mt-2 text-xs text-slate-500">
          Money spent
        </p>
      </div>

      <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-6 shadow-lg shadow-cyan-500/5">
        <p className="text-sm font-medium text-slate-400">
          Balance
        </p>

        <h2
          className={`mt-2 text-3xl font-bold ${
            balance >= 0
              ? "text-cyan-400"
              : "text-red-400"
          }`}
        >
          ₹{balance.toLocaleString("en-IN")}
        </h2>

        <p className="mt-2 text-xs text-slate-500">
          Current balance
        </p>
      </div>
    </div>
  );
}