type StatCardProps = {
  title: string;
  value: string;
  icon: string;
  color: string;
};

export default function StatCard({
  title,
  value,
  icon,
  color,
}: StatCardProps) {
  return (
    <div
      className={`rounded-xl shadow-md p-6 text-white ${color}
      transition duration-300 hover:scale-105 hover:shadow-xl`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm opacity-80">{title}</p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>
        </div>

        <div className="text-4xl">
          {icon}
        </div>
      </div>
    </div>
  );
}