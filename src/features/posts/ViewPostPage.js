// src/features/posts/ViewPostPage.js
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../shared/components/Header";

function Badge({ children, color = "slate" }) {
    const map = {
        slate: "bg-slate-100 text-slate-700",
        emerald: "bg-emerald-50 text-emerald-700",
        indigo: "bg-indigo-50 text-indigo-700",
        amber: "bg-amber-50 text-amber-700",
    };
    return (
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${map[color] || map.slate}`}>
      {children}
    </span>
    );
}

function Skeleton() {
    return (
        <div className="animate-pulse space-y-4">
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="h-8 w-3/4 rounded bg-slate-200" />
            <div className="h-4 w-1/2 rounded bg-slate-200" />
            <div className="h-64 w-full rounded bg-slate-200" />
        </div>
    );
}

export default function ViewPostPage({ onLogout }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setErr("");
        setLoading(true);
        const token = localStorage.getItem("token");
        fetch(`/api/v1/posts/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
            .then(async (res) => {
                if (!res.ok) {
                    const txt = await res.text().catch(() => "");
                    throw new Error(txt || `Failed (${res.status})`);
                }
                return res.json();
            })
            .then(setPost)
            .catch((e) => setErr(e.message || "Failed to load post"))
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <div className="min-h-screen bg-slate-50">
            <Header onLogout={onLogout} />
            <main className="mx-auto max-w-3xl px-4 py-6">
                {/* Top bar */}
                <div className="mb-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        ← Back
                    </button>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href).catch(() => {});
                        }}
                        className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Copy Link
                    </button>
                </div>

                {/* Card */}
                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    {/* Header / meta */}
                    {loading ? (
                        <Skeleton />
                    ) : err ? (
                        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {err}
                        </div>
                    ) : (
                        <>
                            <header className="mb-4">
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                    {/* Status badge */}
                                    {post.status === "DRAFT" ? (
                                        <Badge color="amber">DRAFT</Badge>
                                    ) : (
                                        <Badge color="indigo">Published</Badge>
                                    )}
                                    {/* Reading time if present */}
                                    {typeof post.readingTime === "number" && (
                                        <Badge color="slate">{post.readingTime} min read</Badge>
                                    )}
                                    {/* Category */}
                                    {post.category?.name && <Badge>{post.category.name}</Badge>}
                                </div>

                                <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
                                    {post.title || "(Untitled)"}
                                </h1>

                                {/* Author line */}
                                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                                    {post.author?.name && (
                                        <span className="font-medium text-slate-800">{post.author.name}</span>
                                    )}
                                    {post.author?.email && <span>· {post.author.email}</span>}
                                    {post.createdAt && (
                                        <span>
                      · {new Date(post.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                                    )}
                                </div>

                                {/* Tags */}
                                {post.tags?.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {post.tags.map((t) => (
                                            <span
                                                key={t.id}
                                                className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                                            >
                        #{t.name}
                      </span>
                                        ))}
                                    </div>
                                )}
                            </header>

                            {/* Content */}
                            <div className="prose prose-slate max-w-none text-slate-800">
                                <p className="whitespace-pre-wrap">{post.content}</p>
                            </div>
                        </>
                    )}
                </article>
            </main>
        </div>
    );
}
