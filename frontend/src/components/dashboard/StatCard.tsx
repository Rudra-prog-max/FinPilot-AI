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
      className={`
        relative
        overflow-hidden
        rounded-2xl
        p-6
        text-white
        shadow-lg
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-2xl
        ${color}
      `}
    >
      {/* Decorative Background Circle */}
      <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/10" />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm text-white/80 font-medium">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            {value}
          </h2>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 text-3xl backdrop-blur-sm">
          {icon}
        </div>
      </div>
    </div>
  );
}