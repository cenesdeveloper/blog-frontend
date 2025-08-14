import { useEffect, useState } from "react";
import Header from "../../shared/components/Header";

function TagPage({ onLogout }) {
    const [tags, setTags] = useState([]);
    const [input, setInput] = useState("");
    const [pending, setPending] = useState([]); // tags to create in one go
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchTags = () => {
        fetch("/api/v1/tags")
            .then((res) => res.json())
            .then(setTags)
            .catch(() => setError("Failed to load tags"));
    };

    useEffect(() => {
        fetchTags();
    }, []);

    // add one pending tag (trim, no empty, no dup)
    const addPending = (name) => {
        const clean = name.trim();
        if (!clean) return;
        if (pending.some((n) => n.toLowerCase() === clean.toLowerCase())) return;
        setPending((p) => [...p, clean]);
    };

    // handle typing + Enter/Comma to add
    const onInputKeyDown = (e) => {
        if (e.key === "Enter" || e.key === "," ) {
            e.preventDefault();
            addPending(input);
            setInput("");
        }
    };

    const removePending = (name) => {
        setPending((p) => p.filter((n) => n !== name));
    };

    const createPending = async () => {
        setError("");
        setSuccess("");
        if (pending.length === 0) return;

        const token = localStorage.getItem("token");
        try {
            const res = await fetch("/api/v1/tags", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ names: pending }),
            });

            if (!res.ok) {
                let msg = "Failed to create tags";
                try {
                    const data = await res.json();
                    msg = data.message || msg;
                } catch {}
                setError(msg);
                return;
            }

            setPending([]);
            setSuccess("Tags processed successfully");
            fetchTags();
        } catch {
            setError("Failed to create tags");
        }
    };

    const handleDelete = async (id) => {
        setError("");
        setSuccess("");
        const token = localStorage.getItem("token");
        if (!window.confirm("Are you sure you want to delete this tag?")) return;

        try {
            const res = await fetch(`/api/v1/tags/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setSuccess("Tag deleted");
                fetchTags();
            } else {
                let msg = "Failed to delete tag";
                try {
                    const data = await res.json();
                    msg = data.message || msg;
                } catch {}
                setError(msg);
            }
        } catch {
            setError("Failed to delete tag");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Header onLogout={onLogout} />

            <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-900">Manage Tags</h2>
                </div>

                {/* Create (batch) */}
                <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={onInputKeyDown}
                            placeholder="Type a tag and press Enter (or comma)"
                            className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="button"
                            onClick={() => { addPending(input); setInput(""); }}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Add
                        </button>
                        <button
                            type="button"
                            onClick={createPending}
                            disabled={pending.length === 0}
                            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                        >
                            Create {pending.length > 0 ? `(${pending.length})` : ""}
                        </button>
                    </div>

                    {/* Pending chips */}
                    {pending.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {pending.map((name) => (
                                <span
                                    key={name}
                                    className="inline-flex items-center gap-2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 text-sm"
                                >
                  #{name}
                                    <button
                                        onClick={() => removePending(name)}
                                        className="rounded-full border border-transparent hover:border-indigo-300 hover:bg-indigo-100 px-1"
                                        aria-label={`Remove ${name}`}
                                    >
                    ×
                  </button>
                </span>
                            ))}
                        </div>
                    )}

                    {/* Alerts */}
                    <div className="space-y-2">
                        {error && (
                            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                                {success}
                            </div>
                        )}
                    </div>
                </section>

                {/* Existing tags */}
                <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
                    {tags.length === 0 ? (
                        <p className="text-sm text-slate-600">No tags yet.</p>
                    ) : (
                        <ul className="divide-y divide-slate-200">
                            {tags.map((tag) => (
                                <li key={tag.id} className="flex items-center justify-between py-3">
                                    <p className="text-sm font-medium text-slate-900">#{tag.name}</p>
                                    <button
                                        onClick={() => handleDelete(tag.id)}
                                        className="inline-flex items-center rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </main>
        </div>
    );
}

export default TagPage;
