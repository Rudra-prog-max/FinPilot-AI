import { useEffect, useState } from "react";
import type { FormEvent } from "react";


import SummaryCards from "../../components/transactions/SummaryCards";
import TransactionForm from "../../components/transactions/TransactionForm";
import TransactionFilters from "../../components/transactions/TransactionFilters";
import TransactionTable from "../../components/transactions/TransactionTable";
import DeleteModal from "../../components/transactions/DeleteModal";

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
  const [category, setCategory] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "",
  });

  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

  const expense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

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

  function handleFormChange(
    field: keyof typeof form,
    value: string
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.amount ||
      !form.category.trim()
    ) {
      alert("Please fill all fields.");
      return;
    }

    const amount = Number(form.amount);

    if (amount <= 0) {
      alert("Amount must be greater than 0.");
      return;
    }

    try {
      if (editingId !== null) {
        await updateTransaction(editingId, {
          title: form.title.trim(),
          amount,
          type: form.type,
          category: form.category.trim(),
        });
      } else {
        await createTransaction({
          title: form.title.trim(),
          amount,
          type: form.type,
          category: form.category.trim(),
        });
      }

      resetForm();
      await loadTransactions();
    } catch (error) {
      console.error(
        "Failed to save transaction:",
        error
      );

      alert("Failed to save transaction.");
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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function resetForm() {
    setForm({
      title: "",
      amount: "",
      type: "expense",
      category: "",
    });

    setEditingId(null);
  }

  function handleDeleteRequest(id: number) {
    setDeleteId(id);
  }

  async function handleDeleteConfirm() {
    if (deleteId === null) {
      return;
    }

    try {
      await deleteTransaction(deleteId);

      setDeleteId(null);
      await loadTransactions();
    } catch (error) {
      console.error("Delete failed:", error);

      alert("Failed to delete transaction.");
    }
  }

  const categories = Array.from(
    new Set(
      transactions
        .map((transaction) => transaction.category)
        .filter(Boolean)
    )
  ).sort();

  const filteredTransactions = [...transactions]
    .filter((transaction) => {
      const searchTerm = search.toLowerCase().trim();

      const matchesSearch =
        transaction.title
          .toLowerCase()
          .includes(searchTerm) ||
        transaction.category
          .toLowerCase()
          .includes(searchTerm);

      const matchesType =
        filter === "all" ||
        transaction.type === filter;

      const matchesCategory =
        category === "all" ||
        transaction.category === category;

      const transactionDate = new Date(
        transaction.created_at
      );

      const now = new Date();

      let matchesDate = true;

      if (dateFilter === "today") {
        matchesDate =
          transactionDate.toDateString() ===
          now.toDateString();
      } else if (dateFilter === "week") {
        const startOfWeek = new Date(now);

        startOfWeek.setDate(
          now.getDate() - now.getDay()
        );

        startOfWeek.setHours(0, 0, 0, 0);

        matchesDate =
          transactionDate >= startOfWeek;
      } else if (dateFilter === "month") {
        matchesDate =
          transactionDate.getMonth() ===
            now.getMonth() &&
          transactionDate.getFullYear() ===
            now.getFullYear();
      } else if (dateFilter === "year") {
        matchesDate =
          transactionDate.getFullYear() ===
          now.getFullYear();
      }

      let matchesCustomDate = true;

      if (startDate) {
        const start = new Date(startDate);

        start.setHours(0, 0, 0, 0);

        matchesCustomDate =
          transactionDate >= start;
      }

      if (endDate) {
        const end = new Date(endDate);

        end.setHours(23, 59, 59, 999);

        matchesCustomDate =
          matchesCustomDate &&
          transactionDate <= end;
      }

      return (
        matchesSearch &&
        matchesType &&
        matchesCategory &&
        matchesDate &&
        matchesCustomDate
      );
    })
    .sort((a, b) => {
      let comparison = 0;

      if (sortBy === "amount") {
        comparison = a.amount - b.amount;
      } else if (sortBy === "title") {
        comparison =
          a.title.localeCompare(b.title);
      } else {
        comparison =
          new Date(a.created_at).getTime() -
          new Date(b.created_at).getTime();
      }

      return sortOrder === "asc"
        ? comparison
        : -comparison;
    });

  function clearFilters() {
    setSearch("");
    setFilter("all");
    setCategory("all");
    setDateFilter("all");
    setSortBy("date");
    setSortOrder("desc");
    setStartDate("");
    setEndDate("");
  }

  function exportTransactions() {
    if (filteredTransactions.length === 0) {
      alert("No transactions available to export.");
      return;
    }

    const headers = [
      "Date",
      "Title",
      "Category",
      "Amount",
      "Type",
    ];

    const rows = filteredTransactions.map(
      (transaction) => [
        new Date(
          transaction.created_at
        ).toLocaleDateString("en-IN"),
        transaction.title,
        transaction.category,
        transaction.amount,
        transaction.type,
      ]
    );

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) => {
            const escaped = String(
              value
            ).replace(/"/g, '""');

            return `"${escaped}"`;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `finpilot-transactions-${new Date()
      .toISOString()
      .split("T")[0]}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

            <p className="mt-4 text-slate-400">
              Loading transactions...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-white">
            Transactions
          </h1>

          <p className="mt-2 text-slate-400">
            Track, manage, and analyze your financial
            activity.
          </p>
        </div>

        <SummaryCards
          income={income}
          expense={expense}
          balance={balance}
        />

        <TransactionForm
          form={form}
          editingId={editingId}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />

        <TransactionFilters
          search={search}
          filter={filter}
          category={category}
          sortBy={sortBy}
          sortOrder={sortOrder}
          categories={categories}
          dateFilter={dateFilter}
          onSearchChange={setSearch}
          onFilterChange={setFilter}
          onCategoryChange={setCategory}
          onSortByChange={setSortBy}
          onDateFilterChange={setDateFilter}
          onSortOrderChange={setSortOrder}
          onClear={clearFilters}
          onExport={exportTransactions}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />

        <TransactionTable
          transactions={filteredTransactions}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />
      </div>

      <DeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}