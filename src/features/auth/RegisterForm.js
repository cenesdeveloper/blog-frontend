import { useState } from "react";
import { registerUser } from "../../api/api";

function RegisterForm({ onRegistered }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [matchingPassword, setMatchingPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (isSubmitting) return;

        setError("");

        if (password !== matchingPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setIsSubmitting(true);
            await registerUser(name, email, password, matchingPassword);
            onRegistered?.();
        } catch (err) {
            setError(err.message || "Registration failed");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="rounded-md bg-red-50 text-red-700 text-sm p-3 border border-red-200">
                    {error}
                </div>
            )}

            <div className="space-y-1.5">
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                    Name
                </label>
                <input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    type="text"
                    autoComplete="name"
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400
           shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                    Email
                </label>
                <input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400
           shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    Password
                </label>
                <input
                    id="password"
                    value={password}
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400
           shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div className="space-y-1.5">
                <label htmlFor="matchingPassword" className="block text-sm font-medium text-slate-700">
                    Confirm password
                </label>
                <input
                    id="matchingPassword"
                    value={matchingPassword}
                    type="password"
                    onChange={(e) => setMatchingPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400
           shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white
         shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
            >
                {isSubmitting ? "Creating account..." : "Create account"}
            </button>
        </form>
    );
}

export default RegisterForm;
