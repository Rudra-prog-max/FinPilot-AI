import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { name: "Food", value: 35 },
  { name: "Rent", value: 25 },
  { name: "Transport", value: 20 },
  { name: "Entertainment", value: 20 },
];

const COLORS = [
  "#3B82F6",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
];

export default function ExpensePieChart() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 h-full">
      <h2 className="text-xl font-semibold mb-4">
        Expense Categories
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              label
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}