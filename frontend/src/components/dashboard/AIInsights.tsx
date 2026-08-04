import { Lightbulb } from "lucide-react";

export default function AIInsights() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-center gap-3 mb-4">
        <Lightbulb size={28} />
        <h2 className="text-2xl font-bold">
          AI Insights
        </h2>
      </div>

      <div className="space-y-3">
        <p>
          💡 You spent <strong>18%</strong> more on Food compared to last month.
        </p>

        <p>
          💰 If you reduce entertainment expenses by ₹2,000 each month,
          you could save <strong>₹24,000/year</strong>.
        </p>

        <p>
          📈 Your income has increased by <strong>12%</strong> over the last
          three months.
        </p>
      </div>
    </div>
  );
}