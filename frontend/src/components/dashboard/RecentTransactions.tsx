import { useEffect, useState } from "react";
import {
  getTransactions,
  type Transaction,
} from "../../services/transactionService";


export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getTransactions();

        // Show latest transactions first
        const sortedData = data.sort(
          (
            a: Transaction,
            b: Transaction
          ) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );

        setTransactions(sortedData.slice(0, 5));

      } catch (error) {
        console.error(
          "Failed to fetch transactions:",
          error
        );
      } finally {
        setLoading(false);
      }
    };


    fetchTransactions();

  }, []);



  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        Loading transactions...
      </div>
    );
  }



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



      {transactions.length === 0 ? (

        <p className="text-gray-500">
          No transactions found.
        </p>

      ) : (

        <div className="overflow-x-auto">

          <table className="w-full text-left border-collapse">

            <thead>

              <tr className="border-b">

                <th className="py-3">
                  Date
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

              </tr>

            </thead>


            <tbody>

              {transactions.map((transaction) => (

                <tr
                  key={transaction.id}
                  className="border-b hover:bg-gray-50 transition"
                >

                  <td className="py-3">
                    {new Date(
                      transaction.created_at
                    ).toLocaleDateString()}
                  </td>


                  <td>
                    {transaction.category}
                  </td>


                  <td>
                    ₹{transaction.amount}
                  </td>


                  <td>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        transaction.type === "income"
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

      )}

    </div>
  );
}