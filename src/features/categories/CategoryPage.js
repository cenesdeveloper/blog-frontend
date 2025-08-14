import { useEffect, useState } from "react";
import Header from "../../shared/components/Header";

function CategoryPage({ onLogout }) {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchCategories = () => {
        fetch("/api/v1/categories")
            .then((res) => res.json())
            .then(setCategories)
            .catch(() => setError("Failed to load categories"));
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const token = localStorage.getItem("token");

        const res = await fetch("/api/v1/categories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name: newCategory }),
        });

        if (res.ok) {
            setNewCategory("");
            setSuccess("Category created successfully");
            fetchCategories();
        } else {
            setError("Failed to create category");
        }
    };

    const handleDelete = async (id) => {
        setError("");
        setSuccess("");

        const token = localStorage.getItem("token");

        const res = await fetch(`/api/v1/categories/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
            setSuccess("Category deleted");
            fetchCategories();
        } else {
            setError("Failed to delete category");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Header onLogout={onLogout} />

            <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-900">Manage Categories</h2>
                </div>

                {/* Create form */}
                <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
                    <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
                        <input
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="New category name"
                            className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white
                         hover:bg-indigo-700"
                        >
                            Add Category
                        </button>
                    </form>

                    {/* Alerts */}
                    <div className="mt-3 space-y-2">
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

                {/* Category list */}
                <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
                    {categories.length === 0 ? (
                        <p className="text-sm text-slate-600">No categories yet.</p>
                    ) : (
                        <ul className="divide-y divide-slate-200">
                            {categories.map((cat) => (
                                <li key={cat.id} className="flex items-center justify-between py-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-slate-900">{cat.name}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(cat.id)}
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

export default CategoryPage;
