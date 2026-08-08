import {
  CalendarDays,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Transaction } from "../../services/transactionService";

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
}

const ITEMS_PER_PAGE = 5;

export default function TransactionTable({
  transactions,
  onEdit,
  onDelete,
}: TransactionTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(
    transactions.length / ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (
      currentPage > totalPages &&
      totalPages > 0
    ) {
      setCurrentPage(totalPages);
    }

    if (transactions.length === 0) {
      setCurrentPage(1);
    }
  }, [transactions.length, currentPage, totalPages]);

  const startIndex =
    (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedTransactions = transactions.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  function goToPreviousPage() {
    setCurrentPage((page) => Math.max(page - 1, 1));
  }

  function goToNextPage() {
    setCurrentPage((page) =>
      Math.min(page + 1, totalPages)
    );
  }

  function goToPage(page: number) {
    setCurrentPage(page);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-slate-800 bg-slate-900/80">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-400">
                Date
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-slate-400">
                Transaction
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-slate-400">
                Category
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-slate-400">
                Amount
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-slate-400">
                Type
              </th>

              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-16 text-center"
                >
                  <div className="flex flex-col items-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-800">
                      <CalendarDays
                        size={26}
                        className="text-slate-500"
                      />
                    </div>

                    <p className="font-medium text-slate-300">
                      No transactions found
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Try changing your search or filter.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedTransactions.map(
                (transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-slate-800/80 transition-colors last:border-b-0 hover:bg-slate-800/40"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-300">
                        {new Date(
                          transaction.created_at
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-white">
                        {transaction.title}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm text-slate-300">
                        {transaction.category}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`font-semibold ${
                          transaction.type === "income"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {transaction.type === "income"
                          ? "+"
                          : "-"}
                        ₹
                        {transaction.amount.toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                          transaction.type === "income"
                            ? "border-green-500/30 bg-green-500/10 text-green-400"
                            : "border-red-500/30 bg-red-500/10 text-red-400"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            onEdit(transaction)
                          }
                          title="Edit transaction"
                          className="rounded-lg border border-slate-700 p-2 text-slate-400 transition hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-400"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onDelete(transaction.id)
                          }
                          title="Delete transaction"
                          className="rounded-lg border border-slate-700 p-2 text-slate-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col gap-4 border-t border-slate-800 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-medium text-slate-300">
              {startIndex + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-slate-300">
              {Math.min(
                startIndex + ITEMS_PER_PAGE,
                transactions.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-300">
              {transactions.length}
            </span>{" "}
            transactions
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-700 p-2 text-slate-400 transition hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-1">
              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page)}
                  className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium transition ${
                    currentPage === page
                      ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/20"
                      : "text-slate-400 hover:bg-slate-800 hover:text-cyan-400"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-slate-700 p-2 text-slate-400 transition hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}