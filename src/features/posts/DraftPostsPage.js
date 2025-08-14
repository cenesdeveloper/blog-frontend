import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../shared/components/Header";

function DraftPostsPage({ onLogout }) {
    const [drafts, setDrafts] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const fetchDrafts = async () => {
        setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/v1/posts/drafts", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to load drafts");
            }
            const data = await res.json();
            setDrafts(data);
        } catch (e) {
            setError("Failed to load drafts");
        }
    };

    useEffect(() => {
        fetchDrafts();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            <Header onLogout={onLogout} />

            <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-900">My Drafts</h2>
                    <button
                        onClick={() => navigate("/create")}
                        className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        Create Post
                    </button>
                </div>

                {error && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <section>
                    {drafts.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
                            No drafts yet. Start one{" "}
                            <button
                                onClick={() => navigate("/create")}
                                className="font-medium text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
                            >
                                here
                            </button>
                            .
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {drafts.map((post) => (
                                <div
                                    key={post.id}
                                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4
                                                className="text-base font-semibold text-slate-900 cursor-pointer hover:text-indigo-700"
                                                onClick={() => navigate(`/posts/${post.id}`)}
                                                title="Open draft"
                                            >
                                                {post.title || "(Untitled)"}
                                            </h4>
                                            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                        DRAFT
                      </span>
                                        </div>

                                        <p className="text-sm text-slate-700 line-clamp-4">{post.content}</p>

                                        <div className="flex flex-wrap items-center gap-2">
                                            {post.category?.name && (
                                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                          {post.category.name}
                        </span>
                                            )}
                                            {post.tags?.map((t) => (
                                                <span
                                                    key={t.id}
                                                    className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                                                >
                          #{t.name}
                        </span>
                                            ))}
                                        </div>

                                        <div className="flex gap-2 pt-1">
                                            <button
                                                onClick={() => navigate(`/posts/${post.id}`)}
                                                className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                            >
                                                Continue Editing
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default DraftPostsPage;
