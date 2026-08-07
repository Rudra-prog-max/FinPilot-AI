import {
  LayoutDashboard,
  Wallet,
  BarChart3,
  Target,
  Sparkles,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import Logo from "../ui/Logo";

const navItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Transactions",
    path: "/transactions",
    icon: Wallet,
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Budget",
    path: "/budget",
    icon: Target,
  },
  {
    name: "AI Assistant",
    path: "/ai",
    icon: Sparkles,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-72 min-h-screen bg-slate-950 border-r border-slate-800 flex flex-col">

      {/* Logo */}
      <div className="h-20 flex items-center justify-center border-b border-slate-800">
        <Logo />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-5 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                    : "text-slate-300 hover:bg-slate-800 hover:text-cyan-400"
                }`
              }
            >
              <Icon
                size={22}
                className="transition-transform duration-300 group-hover:scale-110"
              />

              <span className="font-medium">
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-5">
        <div className="rounded-xl bg-slate-900 p-4 border border-slate-800">
          <p className="text-sm font-semibold text-white">
            FinPilot AI
          </p>

          <p className="text-xs text-slate-400 mt-1">
            Smart Personal Finance Assistant
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="rounded-full bg-cyan-500/20 px-2 py-1 text-[11px] font-medium text-cyan-400">
              v1.0.0
            </span>

            <span className="h-2 w-2 rounded-full bg-green-400 shadow shadow-green-400"></span>
          </div>
        </div>
      </div>

    </aside>
  );
}