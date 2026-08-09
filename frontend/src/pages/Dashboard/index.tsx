import StatsGrid from "../../components/dashboard/StatsGrid";
import IncomeExpenseChart from "../../components/dashboard/IncomeExpenseChart";
import ExpensePieChart from "../../components/dashboard/ExpensePieChart";
import RecentTransactions from "../../components/dashboard/RecentTransactions";
import AIInsights from "../../components/dashboard/AIInsights";
import PageHeader from "../../components/ui/PageHeader";

export default function Dashboard() {
  return (
    <>
      <PageHeader
        title="Financial Analytics"
        subtitle="Track your income, expenses and financial performance."
      />

      <StatsGrid />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <IncomeExpenseChart />
        </div>

        <ExpensePieChart />
      </div>

      <RecentTransactions />

      <AIInsights />
    </>
  );
}