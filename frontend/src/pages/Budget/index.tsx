import { useEffect, useState } from "react";

import {
  createBudget,
  deleteBudget,
  getBudgets,
  getBudgetAnalysis,
  type Budget,
  type BudgetAnalysis,
} from "../../services/budgetService";


export default function BudgetPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [analysis, setAnalysis] = useState<BudgetAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    category: "",
    monthly_limit: "",
  });


  async function loadBudgets() {
    try {
      setLoading(true);

      const budgetData = await getBudgets();
      const analysisData = await getBudgetAnalysis();

      setBudgets(budgetData);
      setAnalysis(analysisData);

    } catch (error) {
      console.error(
        "Failed to load budgets:",
        error
      );

    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadBudgets();
  }, []);



  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!form.category || !form.monthly_limit) {
      alert("Please fill all fields");
      return;
    }


    try {
      await createBudget({
        category: form.category,
        monthly_limit: Number(form.monthly_limit),
      });


      setForm({
        category: "",
        monthly_limit: "",
      });


      loadBudgets();

    } catch (error) {
      console.error(
        "Failed to create budget:",
        error
      );
    }
  }



  async function handleDelete(id: number) {
    try {
      await deleteBudget(id);
      loadBudgets();

    } catch (error) {
      console.error(
        "Delete failed:",
        error
      );
    }
  }



  function getAnalysis(category: string) {
    return analysis.find(
      (item) => item.category === category
    );
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
        Budget Planner
      </h1>


      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-6 space-y-4"
      >

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


        <input
          className="w-full border p-3 rounded"
          placeholder="Monthly Limit"
          type="number"
          value={form.monthly_limit}
          onChange={(e) =>
            setForm({
              ...form,
              monthly_limit: e.target.value,
            })
          }
        />


        <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg">
          Add Budget
        </button>

      </form>



      <div className="grid md:grid-cols-2 gap-6 mt-10">

        {budgets.length === 0 ? (

          <div className="bg-white p-6 rounded-xl shadow text-gray-500">
            No budgets created yet.
          </div>

        ) : (

          budgets.map((budget) => {

            const data = getAnalysis(
              budget.category
            );

            return (
              <div
                key={budget.id}
                className="bg-white rounded-xl shadow p-6"
              >

                <div className="flex justify-between items-center">

                  <h2 className="text-xl font-semibold">
                    {budget.category}
                  </h2>

                  <button
                    onClick={() =>
                      handleDelete(budget.id)
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                </div>


                <p className="mt-4 text-lg">
                  Limit:
                  <span className="font-bold">
                    {" "}₹{budget.monthly_limit}
                  </span>
                </p>


                {data && (
                  <>
                    <p className="mt-2">
                      Spent:
                      <span className="font-bold text-red-600">
                        {" "}₹{data.spent}
                      </span>
                    </p>


                    <p>
                      Remaining:
                      <span className="font-bold text-green-600">
                        {" "}₹{data.remaining}
                      </span>
                    </p>


                    <div className="mt-4 bg-gray-200 rounded-full h-3">

                      <div
                        className="bg-cyan-600 h-3 rounded-full"
                        style={{
                          width: `${Math.min(
                            data.percentage,
                            100
                          )}%`,
                        }}
                      />

                    </div>


                    <p className="text-sm mt-2 text-gray-500">
                      {data.percentage}% used
                    </p>

                  </>
                )}

              </div>
            );

          })

        )}

      </div>

    </div>
  );
}