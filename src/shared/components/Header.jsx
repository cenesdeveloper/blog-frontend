import { Link, useNavigate } from "react-router-dom";

export default function Header({ onLogout }) {
    const navigate = useNavigate();

    return (
        <header className="bg-white border-b border-slate-200 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Left: Logo / App Name */}
                <div className="flex items-center gap-6">
          <span
              onClick={() => navigate("/")}
              className="text-lg font-semibold text-slate-800 cursor-pointer"
          >
            Blog Dashboard
          </span>
                    <nav className="hidden sm:flex gap-4">
                        <Link
                            to="/"
                            className="text-sm font-medium text-slate-700 hover:text-indigo-600"
                        >
                            Posts
                        </Link>
                        <Link
                            to="/categories"
                            className="text-sm font-medium text-slate-700 hover:text-indigo-600"
                        >
                            Categories
                        </Link>
                        <Link
                            to="/tags"
                            className="text-sm font-medium text-slate-700 hover:text-indigo-600"
                        >
                            Tags
                        </Link>
                    </nav>
                </div>

                {/* Right: Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate("/create")}
                        className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        Create Post
                    </button>
                    <button
                        onClick={onLogout}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}
