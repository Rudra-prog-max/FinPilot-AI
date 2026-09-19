import { useState } from "react";
import {
  User,
  ShieldCheck,
  Server,
  LogOut,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Settings() {
  const { user, logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage your FinPilot account and security preferences.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
              <User size={20} className="text-cyan-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Profile</h2>
              <p className="text-xs text-slate-500">Your account details</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">Name</p>
              <p className="mt-1 text-sm text-slate-200">{user?.full_name || "FinPilot User"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">Email</p>
              <p className="mt-1 break-all text-sm text-slate-200">{user?.email || "Not available"}</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <ShieldCheck size={20} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Security</h2>
              <p className="text-xs text-slate-500">Account protection</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <CheckCircle2 size={18} className="text-emerald-400" />
              <div>
                <p className="text-sm text-slate-200">Authenticated session</p>
                <p className="text-xs text-slate-500">Protected API requests use your access token.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <Server size={18} className="text-cyan-400" />
              <div>
                <p className="text-sm text-slate-200">User-scoped financial data</p>
                <p className="text-xs text-slate-500">Transactions and budgets are isolated by account.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-white">Sign out</h2>
            <p className="mt-1 text-sm text-slate-400">
              End the current FinPilot session on this device.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowLogout((current) => !current)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
          >
            <LogOut size={17} />
            Log out
          </button>
        </div>

        {showLogout && (
          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/80 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-300">Are you sure you want to log out?</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowLogout(false)}
                className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500"
              >
                Confirm
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
