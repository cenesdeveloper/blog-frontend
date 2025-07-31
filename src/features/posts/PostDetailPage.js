import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function PostDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/api/v1/posts/${id}`)
            .then((res) => res.json())
            .then(setPost);
    }, [id]);

    if (!post) return <p>Loading...</p>;

    return (
        <div>
            <button onClick={() => navigate("/")}>← Back</button>
            <h2>{post.title}</h2>
            <p>Status: {post.status}</p>
            <p>Category: {post.category?.name}</p>
            <p>{post.content}</p>
            <div>
                <h4>Tags:</h4>
                <ul>
                    {post.tags.map((tag) => (
                        <li key={tag.id}>{tag.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default PostDetailPage;
