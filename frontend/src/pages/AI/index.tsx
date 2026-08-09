import { useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  TrendingUp,
  Wallet,
  PiggyBank,
  BarChart3,
  Plus,
} from "lucide-react";
import { sendAIMessage } from "../../services/aiService";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

const suggestions = [
  {
    label: "Analyze my spending",
    icon: BarChart3,
  },
  {
    label: "Where should I cut my spending?",
    icon: TrendingUp,
  },
  {
    label: "Can I afford ₹5000?",
    icon: Wallet,
  },
  {
    label: "How can I save more?",
    icon: PiggyBank,
  },
  {
    label: "Review my budget",
    icon: Wallet,
  },
  {
    label: "Show my financial health",
    icon: TrendingUp,
  },
];
export default function AI() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: trimmedMessage,
    };

    setMessages((current) => [...current, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await sendAIMessage(trimmedMessage);

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: response,
      };

      setMessages((current) => [...current, assistantMessage]);
    } catch (error) {
      console.error("AI request failed:", error);

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          content:
            "I'm having trouble connecting to FinPilot AI right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSuggestion(text: string) {
  if (loading) return;

  const userMessage: Message = {
    id: Date.now(),
    role: "user",
    content: text,
  };

  setMessages((current) => [...current, userMessage]);
  setMessage("");
  setLoading(true);

  try {
    const response = await sendAIMessage(text);

    setMessages((current) => [
      ...current,
      {
        id: Date.now() + 1,
        role: "assistant",
        content: response,
      },
    ]);
  } catch (error) {
    console.error("AI request failed:", error);

    setMessages((current) => [
      ...current,
      {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "I'm having trouble connecting to FinPilot AI right now. Please try again.",
      },
    ]);
  } finally {
    setLoading(false);
  }
}

  function startNewChat() {
    setMessages([]);
    setMessage("");
    setLoading(false);
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col gap-6">
      {/* AI Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">
              FinPilot AI
            </h1>

            <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
              Assistant
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-400">
            Your intelligent financial companion.
          </p>
        </div>

        <button
          type="button"
          onClick={startNewChat}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-cyan-500/40 hover:bg-slate-800 hover:text-white"
        >
          <Plus size={17} />
          New Chat
        </button>
      </div>

      {/* Chat Container */}
      <div className="flex min-h-[650px] flex-1 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70 shadow-xl">
        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl bg-cyan-500/10 blur-2xl" />

              <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-500/20 bg-slate-900">
                <Sparkles
                  size={34}
                  className="text-cyan-400"
                />
              </div>
            </div>

            <h2 className="mt-7 text-center text-2xl font-bold text-white">
              How can I help with your finances?
            </h2>

            <p className="mt-3 max-w-lg text-center text-sm leading-6 text-slate-400">
              Ask FinPilot AI about your spending, budgets,
              savings, transactions, and overall financial
              health.
            </p>

            <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
              {suggestions.map((suggestion) => {
                const Icon = suggestion.icon;

                return (
                  <button
                    key={suggestion.label}
                    type="button"
                    onClick={() =>
                      handleSuggestion(suggestion.label)
                    }
                    className="group flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan-500/30 hover:bg-slate-900"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 transition group-hover:bg-cyan-500/10">
                      <Icon
                        size={18}
                        className="text-slate-400 transition group-hover:text-cyan-400"
                      />
                    </div>

                    <span className="text-sm font-medium text-slate-300 transition group-hover:text-white">
                      {suggestion.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex-1 space-y-6 overflow-y-auto p-5 sm:p-8">
            {messages.map((item) => (
              <div
                key={item.id}
                className={`flex gap-3 ${
                  item.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {item.role === "assistant" && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">
                    <Bot
                      size={18}
                      className="text-cyan-400"
                    />
                  </div>
                )}

                <div
                  className={`max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 ${
                    item.role === "user"
                      ? "rounded-br-md bg-cyan-600 text-white"
                      : "rounded-bl-md border border-slate-800 bg-slate-900 text-slate-300"
                  }`}
                >
                  {item.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">
                  <Bot
                    size={18}
                    className="text-cyan-400"
                  />
                </div>

                <div className="rounded-2xl rounded-bl-md border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-400">
                  FinPilot AI is analyzing your finances...
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-slate-800 bg-slate-900/60 p-4 sm:p-5">
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-4xl items-end gap-3"
          >
            <div className="relative flex-1">
              <textarea
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey
                  ) {
                    e.preventDefault();
                    e.currentTarget.form?.requestSubmit();
                  }
                }}
                rows={1}
                placeholder="Ask FinPilot AI about your finances..."
                disabled={loading}
                className="max-h-32 min-h-[48px] w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={!message.trim() || loading}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-600 text-white shadow-lg shadow-cyan-500/10 transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-40"
              title="Send message"
            >
              <Send size={19} />
            </button>
          </form>

          <p className="mt-3 text-center text-xs text-slate-600">
            FinPilot AI analyzes your financial data and
            provides personalized insights.
          </p>
        </div>
      </div>
    </div>
  );
}