import { useEffect, useState } from "react";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  type Transaction,
} from "../../services/transactionService";

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "",
  });

  // Calculate totals
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  async function loadTransactions() {
    try {
      setLoading(true);

      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error("Failed to load transactions:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!form.title || !form.amount || !form.category) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await createTransaction({
        title: form.title,
        amount: Number(form.amount),
        type: form.type,
        category: form.category,
      });

      setForm({
        title: "",
        amount: "",
        type: "expense",
        category: "",
      });

      loadTransactions();
    } catch (error) {
      console.error("Failed to create transaction:", error);
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteTransaction(id);
      loadTransactions();
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">
        Transactions
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-100 rounded-xl p-6 shadow">
          <h2 className="text-gray-500">Income</h2>
          <p className="text-3xl font-bold text-green-700">
            ₹{income}
          </p>
        </div>

        <div className="bg-red-100 rounded-xl p-6 shadow">
          <h2 className="text-gray-500">Expense</h2>
          <p className="text-3xl font-bold text-red-700">
            ₹{expense}
          </p>
        </div>

        <div className="bg-cyan-100 rounded-xl p-6 shadow">
          <h2 className="text-gray-500">Balance</h2>
          <p className="text-3xl font-bold text-cyan-700">
            ₹{balance}
          </p>
        </div>
      </div>

      {/* Add Transaction Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow"
      >
        <input
          className="w-full border p-3 rounded"
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
        />

        <input
          className="w-full border p-3 rounded"
          placeholder="Amount"
          type="number"
          value={form.amount}
          onChange={(e) =>
            setForm({
              ...form,
              amount: e.target.value,
            })
          }
        />

        <input
          className="w-full border p-3 rounded"
          placeholder="Category"
          value={form.category}
          onChange={(e) =>
            setForm({
              ...form,
              category: e.target.value,
            })
          }
        />

        <select
          className="w-full border p-3 rounded"
          value={form.type}
          onChange={(e) =>
            setForm({
              ...form,
              type: e.target.value,
            })
          }
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <button
          type="submit"
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg transition"
        >
          Add Transaction
        </button>
      </form>

      {/* Transaction List */}
      <div className="mt-10 space-y-4">
        {transactions.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
            No transactions yet.
          </div>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex justify-between items-center bg-white p-4 rounded-xl shadow"
            >
              <div>
                <h3 className="font-semibold text-lg">
                  {transaction.title}
                </h3>

                <p className="text-gray-500">
                  {transaction.category}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <span
                  className={
                    transaction.type === "income"
                      ? "text-green-600 font-bold text-lg"
                      : "text-red-600 font-bold text-lg"
                  }
                >
                  ₹{transaction.amount}
                </span>

                <button
                  onClick={() =>
                    handleDelete(transaction.id)
                  }
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}