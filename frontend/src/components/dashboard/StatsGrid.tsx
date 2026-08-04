import StatCard from "./StatCard";

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <StatCard
        title="Total Balance"
        value="₹1,25,000"
        icon="💰"
        color="bg-blue-600"
      />

      <StatCard
        title="Income"
        value="₹72,000"
        icon="📈"
        color="bg-green-600"
      />

      <StatCard
        title="Expenses"
        value="₹25,000"
        icon="📉"
        color="bg-red-600"
      />

      <StatCard
        title="Savings"
        value="₹47,000"
        icon="💳"
        color="bg-purple-600"
      />
    </div>
  );
}