import { useEffect, useState } from "react";
import { Check, Loader2, ShieldCheck, UserRound } from "lucide-react";
import { getCurrentUser, updateCurrentUser } from "../../services/userService";

export default function Settings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const user = await getCurrentUser();
        setName(user.full_name);
        setEmail(user.email);
      } catch {
        setError("Unable to load your profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSave() {
    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const user = await updateCurrentUser(trimmedName);
      setName(user.full_name);
      setMessage("Profile updated successfully.");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-cyan-400" size={30} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage your FinPilot-AI profile and account.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <UserRound size={21} />
          </div>
          <div>
            <h2 className="font-semibold text-white">Profile</h2>
            <p className="text-sm text-slate-400">Your personal account details.</p>
          </div>
        </div>

        <div className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Full name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Email</span>
            <input
              value={email}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-slate-500"
            />
            <span className="mt-2 block text-xs text-slate-500">
              Email changes are disabled for now to protect account identity.
            </span>
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}
          {message && (
            <p className="flex items-center gap-2 text-sm text-emerald-400">
              <Check size={16} />
              {message}
            </p>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving && <Loader2 size={17} className="animate-spin" />}
            Save changes
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <ShieldCheck size={21} />
          </div>
          <div>
            <h2 className="font-semibold text-white">Security</h2>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              Your financial records are scoped to your authenticated account.
              FinPilot-AI does not expose another user's transaction or budget data
              through the authenticated API.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
