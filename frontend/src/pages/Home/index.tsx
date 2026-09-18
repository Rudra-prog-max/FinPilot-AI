import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Wallet,
  Sparkles,
  BarChart3,
  PieChart,
  BrainCircuit,
  Lock,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Wallet,
      title: "Smart Expense Tracking",
      desc: "Track income and expenses with clean categorized records.",
    },
    {
      icon: BrainCircuit,
      title: "AI Financial Assistant",
      desc: "Ask questions about your spending and receive personalized insights.",
    },
    {
      icon: PieChart,
      title: "Budget Management",
      desc: "Create monthly budgets and monitor remaining limits instantly.",
    },
    {
      icon: BarChart3,
      title: "Powerful Analytics",
      desc: "Visualize trends using beautiful charts and monthly comparisons.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.18),transparent_45%)]" />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center">
          <div className="mb-6 flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
            <Sparkles size={16} />
            AI Powered Personal Finance Platform
          </div>

          <h1 className="max-w-4xl text-5xl font-extrabold leading-tight md:text-7xl">
            Take Control of Your
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {" "}Financial Future
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            FinPilot AI helps you manage expenses, build budgets,
            understand spending habits, and improve your savings with
            intelligent financial insights.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/login"
              className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-300 transition hover:border-cyan-500 hover:text-white"
            >
              Login
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid w-full max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
            {[
              ["10K+", "Transactions"],
              ["98%", "Budget Accuracy"],
              ["24/7", "AI Assistant"],
              ["256-bit", "Secure Data"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur"
              >
                <p className="text-2xl font-bold text-cyan-400">{value}</p>
                <p className="mt-1 text-sm text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-14 text-center">
          <h2 className="text-4xl font-bold">Everything You Need</h2>
          <p className="mt-3 text-slate-400">
            Designed for students, professionals and anyone who wants
            better financial control.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-cyan-500/40"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/10">
                  <Icon size={28} className="text-cyan-400" />
                </div>

                <h3 className="text-lg font-semibold">{item.title}</h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= DASHBOARD PREVIEW ================= */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-4 inline-flex rounded-full bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">
              Dashboard Preview
            </div>

            <h2 className="text-4xl font-bold leading-tight">
              Beautiful analytics with AI-powered insights
            </h2>

            <p className="mt-5 text-slate-400 leading-7">
              Monitor your balance, identify your biggest expenses,
              compare monthly performance, and receive intelligent
              recommendations from FinPilot AI.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Real-time expense overview",
                "Monthly comparison reports",
                "Budget health monitoring",
                "Personal AI financial guidance",
              ].map((text) => (
                <div key={text} className="flex items-center gap-3">
                  <CheckCircle2 className="text-cyan-400" size={20} />
                  <span className="text-slate-300">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mock Dashboard */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">FinPilot Dashboard</h3>
              <span className="text-xs text-cyan-400">LIVE</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-emerald-500/10 p-4">
                <p className="text-xs text-emerald-300">Balance</p>
                <h2 className="mt-2 text-2xl font-bold">₹84,500</h2>
              </div>

              <div className="rounded-xl bg-cyan-500/10 p-4">
                <p className="text-xs text-cyan-300">Income</p>
                <h2 className="mt-2 text-2xl font-bold">₹1,20,000</h2>
              </div>

              <div className="rounded-xl bg-rose-500/10 p-4">
                <p className="text-xs text-rose-300">Expenses</p>
                <h2 className="mt-2 text-2xl font-bold">₹35,500</h2>
              </div>

              <div className="rounded-xl bg-violet-500/10 p-4">
                <p className="text-xs text-violet-300">Savings</p>
                <h2 className="mt-2 text-2xl font-bold">70%</h2>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-slate-950 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-slate-300">Expense Trend</p>
                <span className="text-xs text-emerald-400">
                  +12%
                </span>
              </div>

              <div className="flex h-32 items-end gap-2">
                {[35, 60, 45, 80, 55, 95, 70].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-gradient-to-t from-cyan-600 to-cyan-400"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECURITY ================= */}
      <section className="border-y border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">
                Privacy First
              </div>

              <h2 className="text-4xl font-bold">
                Your financial data stays protected
              </h2>

              <p className="mt-5 leading-7 text-slate-400">
                FinPilot AI is built with authentication, secure APIs,
                encrypted passwords, and user-specific data isolation so
                every account only accesses its own financial records.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["JWT Authentication", ShieldCheck],
                ["Encrypted Passwords", Lock],
                ["Private User Data", ShieldCheck],
                ["Secure API Access", Lock],
              ].map(([title, Icon]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                >
                  <Icon className="mb-3 text-cyan-400" size={26} />
                  <h3 className="font-semibold">{title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <h2 className="text-4xl font-bold">
          Ready to build better financial habits?
        </h2>

        <p className="mt-4 text-lg text-slate-400">
          Join FinPilot AI and start understanding your money with
          intelligent insights.
        </p>

        <Link
          to="/register"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-8 py-4 text-lg font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          Create Free Account
          <ArrowRight size={20} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-500">
        © 2026 FinPilot AI • Smart Personal Finance Assistant
      </footer>
    </div>
  );
}