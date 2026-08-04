const transactions = [
  {
    id: 1,
    date: "31 Jul 2026",
    category: "Food",
    amount: "₹500",
    type: "Expense",
  },
  {
    id: 2,
    date: "30 Jul 2026",
    category: "Salary",
    amount: "₹50,000",
    type: "Income",
  },
  {
    id: 3,
    date: "29 Jul 2026",
    category: "Shopping",
    amount: "₹2,200",
    type: "Expense",
  },
  {
    id: 4,
    date: "28 Jul 2026",
    category: "Freelance",
    amount: "₹8,000",
    type: "Income",
  },
];

export default function RecentTransactions() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Recent Transactions
        </h2>

        <button className="text-blue-600 hover:underline">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-3">Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Type</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-3">{transaction.date}</td>
                <td>{transaction.category}</td>
                <td>{transaction.amount}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      transaction.type === "Income"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {transaction.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
