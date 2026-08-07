export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 shadow-lg shadow-cyan-500/30">

        {/* Decorative glow */}
        <div className="absolute inset-0 rounded-2xl bg-cyan-400/20 blur-lg" />

        <span className="relative text-lg font-extrabold text-white">
          FP
        </span>

      </div>

      <div>
        <h1 className="text-xl font-bold tracking-wide text-white">
          FinPilot
        </h1>

        <p className="text-xs text-slate-400">
          AI Finance Assistant
        </p>
      </div>
    </div>
  );
}