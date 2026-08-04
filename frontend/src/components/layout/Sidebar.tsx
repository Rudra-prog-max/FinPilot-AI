function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-8">
        FinPilot
      </h2>

      <nav className="space-y-4">
        <p>🏠 Dashboard</p>
        <p>💳 Transactions</p>
        <p>📊 Analytics</p>
        <p>💰 Budget</p>
        <p>🤖 AI Assistant</p>
        <p>⚙ Settings</p>
      </nav>
    </aside>
  );
}

export default Sidebar;
