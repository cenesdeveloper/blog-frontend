import { useEffect, useState } from "react";
import Header from "../../shared/components/Header";

function CreatePostPage({ onLogout }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("PUBLISHED");
    const [categoryId, setCategoryId] = useState("");
    const [tagIds, setTagIds] = useState([]);

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetch("/api/v1/categories")
            .then((res) => res.json())
            .then(setCategories)
            .catch(console.error);

        fetch("/api/v1/tags")
            .then((res) => res.json())
            .then(setTags)
            .catch(console.error);
    }, []);

    const toggleTag = (tagId) => {
        setTagIds((prev) =>
            prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const token = localStorage.getItem("token");
        if (!token) {
            setError("Not authenticated");
            return;
        }

        const postData = { title, content, status, categoryId, tagIds };

        try {
            const res = await fetch("/api/v1/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(postData),
            });

            if (!res.ok) throw new Error("Failed to create post");

            setTitle("");
            setContent("");
            setStatus("PUBLISHED");
            setCategoryId("");
            setTagIds([]);
            setSuccess("Post created successfully!");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Header onLogout={onLogout} />

            <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-900">Create New Post</h2>
                </div>

                <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Post title"
                                required
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write your post..."
                                required
                                className="min-h-[160px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Row: Status + Category */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900
                             focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="PUBLISHED">Published</option>
                                    <option value="DRAFT">Draft</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    required
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900
                             focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">-- Select a category --</option>
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
                            <p className="text-sm font-medium text-slate-700 mb-2">Tags</p>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <label key={tag.id} className="inline-flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            value={tag.id}
                                            checked={tagIds.includes(tag.id)}
                                            onChange={() => toggleTag(tag.id)}
                                            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-slate-700">#{tag.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="submit"
                                className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                            >
                                Create Post
                            </button>
                            {success && (
                                <span className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {success}
                </span>
                            )}
                            {error && (
                                <span className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </span>
                            )}
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
}

export default CreatePostPage;
