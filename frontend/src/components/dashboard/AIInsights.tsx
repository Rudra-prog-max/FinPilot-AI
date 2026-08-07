import { useEffect, useState } from "react";
import {
  Sparkles,
  BrainCircuit,
  TrendingUp,
  TriangleAlert,
  CircleCheckBig,
} from "lucide-react";

import {
  getInsights,
  type Insight,
} from "../../services/insightService";

export default function AIInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInsights() {
      try {
        const data = await getInsights();
        setInsights(data);
      } catch (error) {
        console.error(
          "Failed to load AI insights:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadInsights();
  }, []);

  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950 p-6 shadow-lg">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">

        <div>
          <h2 className="flex items-center gap-3 text-2xl font-bold text-white">
            <BrainCircuit
              className="text-cyan-400"
              size={30}
            />
            AI Financial Insights
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Personalized recommendations based on your finances
          </p>
        </div>

        <div className="rounded-xl bg-cyan-500/20 p-3">
          <Sparkles
            className="text-cyan-400"
            size={28}
          />
        </div>

      </div>

      {loading ? (

        <div className="space-y-3">

          <div className="h-5 w-full animate-pulse rounded bg-slate-700" />

          <div className="h-5 w-5/6 animate-pulse rounded bg-slate-700" />

          <div className="h-5 w-2/3 animate-pulse rounded bg-slate-700" />

        </div>

      ) : insights.length === 0 ? (

        <div className="rounded-xl border border-dashed border-slate-700 py-10 text-center">

          <Sparkles
            size={40}
            className="mx-auto mb-4 text-slate-500"
          />

          <p className="text-slate-400">
            No insights available yet.
          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {insights.map((insight, index) => {

            const Icon =
              insight.message.toLowerCase().includes("warning") ||
              insight.message.toLowerCase().includes("overspend")
                ? TriangleAlert
                : insight.message.toLowerCase().includes("save")
                ? TrendingUp
                : CircleCheckBig;

            return (
              <div
                key={index}
                className="flex items-start gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4 transition-all duration-300 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10"
              >

                <div className="rounded-lg bg-cyan-500/20 p-2">

                  <Icon
                    size={20}
                    className="text-cyan-400"
                  />

                </div>

                <p className="leading-relaxed text-slate-200">
                  {insight.message}
                </p>

              </div>
            );
          })}

        </div>

      )}

      {/* Footer */}

      <div className="mt-8 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-slate-400">
              Financial Health
            </p>

            <h3 className="mt-1 text-2xl font-bold text-white">
              82 / 100
            </h3>

          </div>

          <div className="rounded-full bg-green-500/20 px-4 py-2">

            <span className="font-semibold text-green-400">
              Good
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}