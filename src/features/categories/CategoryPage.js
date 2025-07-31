import { useEffect, useState } from "react";

function CategoryPage() {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchCategories = () => {
        fetch("http://localhost:8080/api/v1/categories")
            .then(res => res.json())
            .then(setCategories)
            .catch(err => setError("Failed to load categories"));
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:8080/api/v1/categories", {
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

        const res = await fetch(`http://localhost:8080/api/v1/categories/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.ok) {
            setSuccess("Category deleted");
            fetchCategories();
        } else {
            setError("Failed to delete category");
        }
    };

    return (
        <div>
            <h2>Manage Categories</h2>

            <form onSubmit={handleCreate}>
                <input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New Category Name"
                />
                <button type="submit">Add Category</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <ul>
                {categories.map((cat) => (
                    <li key={cat.id}>
                        {cat.name}
                        <button onClick={() => handleDelete(cat.id)} style={{ marginLeft: "10px" }}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CategoryPage;
