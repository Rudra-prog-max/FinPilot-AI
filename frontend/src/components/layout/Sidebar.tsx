import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-6">

      <h2 className="text-2xl font-bold mb-8">
        FinPilot
      </h2>


      <nav className="space-y-4">

        <Link
          to="/dashboard"
          className="block hover:text-cyan-400"
        >
          🏠 Dashboard
        </Link>


        <Link
          to="/transactions"
          className="block hover:text-cyan-400"
        >
          💳 Transactions
        </Link>


        <Link
          to="/analytics"
          className="block hover:text-cyan-400"
        >
          📊 Analytics
        </Link>


        <Link
          to="/budget"
          className="block hover:text-cyan-400"
        >
          💰 Budget
        </Link>


        <Link
          to="/ai"
          className="block hover:text-cyan-400"
        >
          🤖 AI Assistant
        </Link>


        <Link
          to="/settings"
          className="block hover:text-cyan-400"
        >
          ⚙ Settings
        </Link>

      </nav>

    </aside>
  );
}

export default Sidebar;