import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../shared/components/Header";
import { getCurrentUserId, getCurrentUserEmail } from "../../shared/auth";

function MainPage({ onLogout }) {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [editingPostId, setEditingPostId] = useState(null);
    const [editFields, setEditFields] = useState({});
    const navigate = useNavigate();

    const currentUserId = getCurrentUserId();
    const currentUserEmail = getCurrentUserEmail();
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch("/api/v1/categories").then(r => r.json()).then(setCategories);
        fetch("/api/v1/tags").then(r => r.json()).then(setTags);
    }, []);

    // Build URL with multiple categoryId & tagId query params + log IDs for sanity
    useEffect(() => {
        let url = "/api/v1/posts";
        const params = new URLSearchParams();

        selectedCategories.forEach(id => params.append("categoryId", id));
        selectedTags.forEach(id => params.append("tagId", id));

        const qs = params.toString();
        if (qs) url += "?" + qs;

        fetch(url)
            .then(r => r.json())
            .then(data => {
                console.log("currentUserId:", currentUserId);
                console.log("currentUserEmail:", currentUserEmail);
                console.log("first post author id:", data?.[0]?.author?.id);
                console.log("first post author email:", data?.[0]?.author?.email);
                setPosts(data);
            });
    }, [selectedCategories, selectedTags, currentUserId, currentUserEmail]);

    // Ownership helper: try id match, else email match
    const isOwner = (post) => {
        const aid = post?.author?.id;
        const aemail = post?.author?.email;
        if (aid && currentUserId && String(aid) === String(currentUserId)) return true;
        if (
            aemail && currentUserEmail &&
            String(aemail).toLowerCase() === String(currentUserEmail).toLowerCase()
        ) return true;
        return false;
    };

    const handleDelete = async (id) => {
        const post = posts.find(p => p.id === id);
        if (!isOwner(post)) return; // defensive
        await fetch(`/api/v1/posts/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(prev => prev.filter(p => p.id !== id));
    };

    const handleEdit = (post) => {
        if (!isOwner(post)) return; // defensive
        setEditingPostId(post.id);
        setEditFields({
            id: post.id,
            title: post.title,
            content: post.content,
            status: post.status,
            categoryId: post.category?.id,
            tagIds: post.tags.map(t => t.id),
        });
    };

    const handleUpdate = async (id) => {
        if (!editFields.categoryId) {
            alert("Please select a category before updating.");
            return;
        }
        const res = await fetch(`/api/v1/posts/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(editFields),
        });

        if (!res.ok) {
            const errorText = await res.text();
            alert(`Failed to update post: ${res.status} - ${errorText}`);
            return;
        }

        setEditingPostId(null);
        fetch("/api/v1/posts").then(r => r.json()).then(setPosts);
    };

    const toggleTagInEdit = (tagId) => {
        setEditFields(prev => ({
            ...prev,
            tagIds: prev.tagIds.includes(tagId)
                ? prev.tagIds.filter(id => id !== tagId)
                : [...prev.tagIds, tagId],
        }));
    };

    // Filter toggles
    const toggleCategoryFilter = (id) => {
        setSelectedCategories(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };
    const toggleTagFilter = (id) => {
        setSelectedTags(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const clearCategories = () => setSelectedCategories([]);
    const clearTags = () => setSelectedTags([]);

    return (
        <div className="min-h-screen bg-slate-50">
            <Header onLogout={onLogout} />

            <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
                {/* Filters */}
                <section className="grid gap-4 sm:grid-cols-2">
                    {/* Category filter */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-slate-800">
                                Filter by Category
                            </h4>
                            <button onClick={clearCategories} className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                                Clear
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => {
                                const active = selectedCategories.includes(cat.id);
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => toggleCategoryFilter(cat.id)}
                                        className={[
                                            "px-3 py-1.5 rounded-full text-sm border",
                                            active
                                                ? "bg-indigo-600 text-white border-indigo-600"
                                                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50",
                                        ].join(" ")}
                                    >
                                        {cat.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tag filter */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-slate-800">
                                Filter by Tag
                            </h4>
                            <button onClick={clearTags} className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                                Clear
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => {
                                const active = selectedTags.includes(tag.id);
                                return (
                                    <button
                                        key={tag.id}
                                        onClick={() => toggleTagFilter(tag.id)}
                                        className={[
                                            "px-3 py-1.5 rounded-full text-sm border",
                                            active
                                                ? "bg-emerald-600 text-white border-emerald-600"
                                                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50",
                                        ].join(" ")}
                                    >
                                        {tag.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Posts */}
                <section>
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-900">Posts</h3>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <div key={post.id} className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition">
                                {editingPostId === post.id ? (
                                    <div className="space-y-3">
                                        <input
                                            value={editFields.title}
                                            onChange={(e) => setEditFields(prev => ({ ...prev, title: e.target.value }))}
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Title"
                                        />
                                        <textarea
                                            value={editFields.content}
                                            onChange={(e) => setEditFields(prev => ({ ...prev, content: e.target.value }))}
                                            className="min-h-[120px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Content"
                                        />

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-slate-600">Status</label>
                                                <select
                                                    value={editFields.status}
                                                    onChange={(e) => setEditFields(prev => ({ ...prev, status: e.target.value.toUpperCase() }))}
                                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                                                >
                                                    <option value="PUBLISHED">Published</option>
                                                    <option value="DRAFT">Draft</option>
                                                </select>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-slate-600">Category</label>
                                                <select
                                                    value={editFields.categoryId || ""}
                                                    onChange={(e) => setEditFields(prev => ({ ...prev, categoryId: e.target.value }))}
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

                                        <div>
                                            <p className="mb-2 text-xs font-medium text-slate-600">Tags</p>
                                            <div className="flex flex-wrap gap-2">
                                                {tags.map((tag) => (
                                                    <label key={tag.id} className="inline-flex items-center gap-2 text-sm">
                                                        <input
                                                            type="checkbox"
                                                            checked={editFields.tagIds?.includes(tag.id)}
                                                            onChange={() => toggleTagInEdit(tag.id)}
                                                            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                        <span className="text-slate-700">{tag.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleUpdate(post.id)}
                                                className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingPostId(null)}
                                                className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <h4
                                            className="text-base font-semibold text-slate-900 underline underline-offset-4 cursor-pointer hover:text-indigo-700"
                                            onClick={() => navigate(`/view/${post.id}`)}
                                        >
                                            {post.title}
                                        </h4>
                                        <p className="text-sm text-slate-700 line-clamp-4">{post.content}</p>

                                        <div className="flex flex-wrap items-center gap-2">
                                            {post.category?.name && (
                                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                          {post.category.name}
                        </span>
                                            )}
                                            {post.tags?.map((t) => (
                                                <span key={t.id} className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          #{t.name}
                        </span>
                                            ))}
                                        </div>

                                        {isOwner(post) && (
                                            <div className="flex gap-2 pt-1">
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    className="inline-flex items-center rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
                                                >
                                                    Delete
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(post)}
                                                    className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                                >
                                                    Update
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {posts.length === 0 && (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
                            No posts found. Try clearing filters or{" "}
                            <button
                                onClick={() => navigate("/create")}
                                className="font-medium text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
                            >
                                create a new post
                            </button>
                            .
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default MainPage;
