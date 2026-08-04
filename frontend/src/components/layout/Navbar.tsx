function Navbar() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
      <h1 className="text-xl font-bold text-slate-800">
        FinPilot-AI
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-slate-600">
          Welcome, Rudra
        </span>

        <div className="w-10 h-10 rounded-full bg-cyan-500"></div>
      </div>
    </header>
  );
}

export default Navbar;
