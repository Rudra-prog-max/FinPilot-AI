import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
} from "lucide-react";

import {
  getTransactions,
  type Transaction,
} from "../../services/transactionService";

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const data = await getTransactions();
        console.log("Transactions:", data);

        const sorted = [...data].sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );

        setTransactions(sorted.slice(0, 5));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, []);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">

        <div>
          <h2 className="text-xl font-bold text-white">
            Recent Transactions
          </h2>

          <p className="text-sm text-slate-400">
            Your latest financial activity
          </p>
        </div>

        <button className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition">
          View All
          <ArrowRight size={18} />
        </button>

      </div>

      {loading ? (

        <p className="text-slate-400">
          Loading transactions...
        </p>

      ) : transactions.length === 0 ? (

        <div className="rounded-xl border border-dashed border-slate-700 py-12 text-center">

          <Wallet
            className="mx-auto mb-4 text-slate-500"
            size={42}
          />

          <p className="text-slate-400">
            No recent transactions found.
          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {transactions.map((transaction) => (

            <div
              key={transaction.id}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4 transition-all duration-300 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10"
            >

              {/* Left */}
              <div className="flex items-center gap-4">

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    transaction.type === "income"
                      ? "bg-green-500/20"
                      : "bg-red-500/20"
                  }`}
                >
                  {transaction.type === "income" ? (
                    <ArrowDownLeft
                      className="text-green-400"
                      size={22}
                    />
                  ) : (
                    <ArrowUpRight
                      className="text-red-400"
                      size={22}
                    />
                  )}
                </div>

                <div>

                  <h3 className="font-semibold text-white">
                    {transaction.title}
                  </h3>

                  <p className="text-sm text-slate-400">
                    {transaction.category}
                  </p>

                </div>

              </div>

              {/* Right */}
              <div className="text-right">

                <p
                  className={`text-lg font-bold ${
                    transaction.type === "income"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {transaction.type === "income"
                    ? "+"
                    : "-"}
                  ₹{transaction.amount.toLocaleString("en-IN")}
                </p>

                <p className="text-sm text-slate-500">
                  {new Date(
                    transaction.created_at
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}