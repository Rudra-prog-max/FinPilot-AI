import { useEffect, useState } from "react";

import {
  createTransaction,
  deleteTransaction,
  updateTransaction,
  getTransactions,
  type Transaction,
} from "../../services/transactionService";


export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "",
  });


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
      console.error(
        "Failed to load transactions:",
        error
      );

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


    if (
      !form.title ||
      !form.amount ||
      !form.category
    ) {
      alert("Please fill all fields");
      return;
    }


    try {

      if (editingId) {

        await updateTransaction(
          editingId,
          {
            title: form.title,
            amount: Number(form.amount),
            type: form.type,
            category: form.category,
          }
        );

      } else {

        await createTransaction({
          title: form.title,
          amount: Number(form.amount),
          type: form.type,
          category: form.category,
        });

      }


      setForm({
        title: "",
        amount: "",
        type: "expense",
        category: "",
      });


      setEditingId(null);

      loadTransactions();


    } catch (error) {

      console.error(
        "Failed to save transaction:",
        error
      );

    }
  }




  async function handleDelete(id: number) {
    try {

      await deleteTransaction(id);

      loadTransactions();

    } catch (error) {

      console.error(
        "Delete failed:",
        error
      );

    }
  }




  function handleEdit(transaction: Transaction) {

    setEditingId(transaction.id);

    setForm({
      title: transaction.title,
      amount: String(transaction.amount),
      type: transaction.type,
      category: transaction.category,
    });

  }




  const filteredTransactions =
    transactions.filter((transaction) => {

      const matchesSearch =
        transaction.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        transaction.category
          .toLowerCase()
          .includes(search.toLowerCase());


      const matchesFilter =
        filter === "all" ||
        transaction.type === filter;


      return matchesSearch && matchesFilter;

    });



  if (loading) {
    return (
      <div className="p-8 text-center text-xl font-semibold">
        Loading...
      </div>
    );
  }



  return (
    <div className="max-w-6xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-8">
        Transactions
      </h1>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-green-100 rounded-xl p-6 shadow">
          <h2 className="text-gray-500">
            Income
          </h2>
          <p className="text-3xl font-bold text-green-700">
            ₹{income}
          </p>
        </div>


        <div className="bg-red-100 rounded-xl p-6 shadow">
          <h2 className="text-gray-500">
            Expense
          </h2>
          <p className="text-3xl font-bold text-red-700">
            ₹{expense}
          </p>
        </div>


        <div className="bg-cyan-100 rounded-xl p-6 shadow">
          <h2 className="text-gray-500">
            Balance
          </h2>
          <p className="text-3xl font-bold text-cyan-700">
            ₹{balance}
          </p>
        </div>

      </div>



      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-4"
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

          <option value="income">
            Income
          </option>

          <option value="expense">
            Expense
          </option>

        </select>


        <button
          className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700"
        >
          {editingId
            ? "Update Transaction"
            : "Add Transaction"}
        </button>

      </form>




      <div className="mt-10 bg-white p-6 rounded-xl shadow flex flex-col md:flex-row gap-4">

        <input
          className="flex-1 border p-3 rounded"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />


        <select
          className="border p-3 rounded"
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
        >

          <option value="all">
            All
          </option>

          <option value="income">
            Income
          </option>

          <option value="expense">
            Expense
          </option>

        </select>

      </div>




      <div className="mt-10 bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full text-left">

          <thead className="border-b">

            <tr>

              <th className="p-4">
                Date
              </th>

              <th>
                Title
              </th>

              <th>
                Category
              </th>

              <th>
                Amount
              </th>

              <th>
                Type
              </th>

              <th>
                Action
              </th>

            </tr>

          </thead>


          <tbody>

            {filteredTransactions.map((transaction) => (

              <tr
                key={transaction.id}
                className="border-b hover:bg-gray-50"
              >

                <td className="p-4">
                  {new Date(
                    transaction.created_at
                  ).toLocaleDateString()}
                </td>


                <td>
                  {transaction.title}
                </td>


                <td>
                  {transaction.category}
                </td>


                <td
                  className={
                    transaction.type === "income"
                      ? "text-green-600 font-bold"
                      : "text-red-600 font-bold"
                  }
                >
                  ₹{transaction.amount}
                </td>


                <td>
                  {transaction.type}
                </td>


                <td>

                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        handleEdit(transaction)
                      }
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>


                    <button
                      onClick={() =>
                        handleDelete(transaction.id)
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}