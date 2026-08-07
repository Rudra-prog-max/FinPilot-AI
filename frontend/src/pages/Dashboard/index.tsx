import Layout from "../../components/layout/Layout";

import StatsGrid from "../../components/dashboard/StatsGrid";
import IncomeExpenseChart from "../../components/dashboard/IncomeExpenseChart";
import ExpensePieChart from "../../components/dashboard/ExpensePieChart";
import RecentTransactions from "../../components/dashboard/RecentTransactions";
import AIInsights from "../../components/dashboard/AIInsights";
import PageHeader from "../../components/ui/PageHeader";


export default function Dashboard() {
  return (
    <Layout>
      <div className="space-y-8">
        <PageHeader
         title="Dashboard"
         subtitle="Welcome back to FinPilot-AI."
        />

        <StatsGrid />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <IncomeExpenseChart />
          </div>

          <ExpensePieChart />
        </div>

        <RecentTransactions />

        <AIInsights />
      </div>
    </Layout>
  );
}