import { useEffect, useState } from "react";
import Header from "../../shared/components/Header";

function DraftPostsPage({ onLogout }) {
    const [drafts, setDrafts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);

    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    // inline edit state
    const [editingId, setEditingId] = useState(null);
    const [editFields, setEditFields] = useState({
        id: "",
        title: "",
        content: "",
        status: "DRAFT",
        categoryId: "",
        tagIds: [],
    });

    const token = localStorage.getItem("token");

    const fetchDrafts = async () => {
        setError("");
        try {
            const res = await fetch("/api/v1/posts/drafts", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            setDrafts(data);
        } catch {
            setError("Failed to load drafts");
        }
    };

    const fetchMeta = async () => {
        try {
            const [cats, tgs] = await Promise.all([
                fetch("/api/v1/categories").then((r) => r.json()),
                fetch("/api/v1/tags").then((r) => r.json()),
            ]);
            setCategories(cats);
            setTags(tgs);
        } catch {
            // non-fatal
        }
    };

    useEffect(() => {
        fetchDrafts();
        fetchMeta();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // start editing a draft
    const handleEdit = (post) => {
        setEditingId(post.id);
        setEditFields({
            id: post.id,
            title: post.title || "",
            content: post.content || "",
            status: post.status || "DRAFT",
            categoryId: post.category?.id || "",
            tagIds: (post.tags || []).map((t) => t.id),
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const toggleTagInEdit = (tagId) => {
        setEditFields((prev) => ({
            ...prev,
            tagIds: prev.tagIds.includes(tagId)
                ? prev.tagIds.filter((id) => id !== tagId)
                : [...prev.tagIds, tagId],
        }));
    };

    const handleUpdate = async (id) => {
        setSaving(true);
        setError("");
        try {
            const res = await fetch(`/api/v1/posts/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(editFields),
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Update failed");
            }
            setEditingId(null);
            await fetchDrafts(); // refresh list
        } catch (e) {
            setError("Failed to update draft");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Header onLogout={onLogout} />

            <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-900">My Drafts</h2>
                    <a
                        href="/create"
                        className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        Create Post
                    </a>
                </div>

                {error && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {drafts.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
                        No drafts yet. Start one{" "}
                        <a
                            href="/create"
                            className="font-medium text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
                        >
                            here
                        </a>
                        .
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {drafts.map((post) => {
                            const isEditing = editingId === post.id;
                            return (
                                <div
                                    key={post.id}
                                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition"
                                >
                                    {!isEditing ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-base font-semibold text-slate-900">
                                                    {post.title || "(Untitled)"}
                                                </h4>
                                                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                          DRAFT
                        </span>
                                            </div>
                                            <p className="text-sm text-slate-700 line-clamp-4">
                                                {post.content}
                                            </p>
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
                                                    onClick={() => handleEdit(post)}
                                                    className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                                >
                                                    Continue Editing
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {/* Title */}
                                            <input
                                                value={editFields.title}
                                                onChange={(e) =>
                                                    setEditFields((prev) => ({
                                                        ...prev,
                                                        title: e.target.value,
                                                    }))
                                                }
                                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                                                placeholder="Title"
                                            />
                                            {/* Content */}
                                            <textarea
                                                value={editFields.content}
                                                onChange={(e) =>
                                                    setEditFields((prev) => ({
                                                        ...prev,
                                                        content: e.target.value,
                                                    }))
                                                }
                                                className="min-h-[120px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                                                placeholder="Content"
                                            />
                                            {/* Status + Category */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-medium text-slate-600">
                                                        Status
                                                    </label>
                                                    <select
                                                        value={editFields.status}
                                                        onChange={(e) =>
                                                            setEditFields((prev) => ({
                                                                ...prev,
                                                                status: e.target.value.toUpperCase(),
                                                            }))
                                                        }
                                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                                                    >
                                                        <option value="DRAFT">Draft</option>
                                                        <option value="PUBLISHED">Published</option>
                                                    </select>
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="text-xs font-medium text-slate-600">
                                                        Category
                                                    </label>
                                                    <select
                                                        value={editFields.categoryId || ""}
                                                        onChange={(e) =>
                                                            setEditFields((prev) => ({
                                                                ...prev,
                                                                categoryId: e.target.value,
                                                            }))
                                                        }
                                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                                                    >
                                                        <option value="">-- Category --</option>
                                                        {categories.map((cat) => (
                                                            <option key={cat.id} value={cat.id}>
                                                                {cat.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Tags */}
                                            <div>
                                                <p className="mb-2 text-xs font-medium text-slate-600">
                                                    Tags
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {tags.map((tag) => (
                                                        <label
                                                            key={tag.id}
                                                            className="inline-flex items-center gap-2 text-sm"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={editFields.tagIds.includes(tag.id)}
                                                                onChange={() => toggleTagInEdit(tag.id)}
                                                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                            />
                                                            <span className="text-slate-700">
                                #{tag.name}
                              </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleUpdate(post.id)}
                                                    disabled={saving}
                                                    className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                                                >
                                                    {saving ? "Saving..." : "Save"}
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}

export default DraftPostsPage;
