import { useEffect, useState } from "react";
import { fetchCategories } from "../api/api";

function CategoryPage() {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCategories()
            .then(setCategories)
            .catch((err) => setError(err.message));
    }, []);

    if (error) return <p>Error: {error}</p>;

    return (
        <ul>
            {categories.map((c) => (
                <li key={c.id}>{c.name}</li>
            ))}
        </ul>
    );
}

export default CategoryPage;
