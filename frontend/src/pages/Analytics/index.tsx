
import AnalyticsSummary from "../../components/analytics/AnalyticsSummary";
import MonthlyChart from "../../components/analytics/MonthlyChart";
import CategoryChart from "../../components/analytics/CategoryChart";
import FinancialInsights from "../../components/analytics/FinancialInsights";

export default function Analytics() {
  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Financial Analytics
          </h1>

          <p className="mt-2 text-slate-400">
            Track your income, expenses and financial performance.
          </p>
        </div>

        <AnalyticsSummary />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <MonthlyChart />
          </div>

          <CategoryChart />
        </div>

        <FinancialInsights />
      </div>
    </>
  );
}