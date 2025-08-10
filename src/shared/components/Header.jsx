import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header({ onLogout, userName }) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const onDocClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    const initials =
        (userName || "")
            .trim()
            .split(" ")
            .map((s) => s[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || null;

    return (
        <header className="bg-white/90 backdrop-blur border-b border-slate-200 sticky top-0 z-10">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

                {/* Left: brand + nav */}
                <div className="flex items-center gap-6">
                    <span
                        onClick={() => navigate("/")}
                        className="text-lg sm:text-xl font-semibold text-slate-800 cursor-pointer"
                    >
                        Blog Dashboard
                    </span>
                    <nav className="hidden sm:flex gap-4">
                        <Link className="text-sm font-medium text-slate-700 hover:text-indigo-600" to="/">Posts</Link>
                        <Link className="text-sm font-medium text-slate-700 hover:text-indigo-600" to="/categories">Categories</Link>
                        <Link className="text-sm font-medium text-slate-700 hover:text-indigo-600" to="/tags">Tags</Link>
                    </nav>
                </div>

                {/* Right: drafts + create + user menu */}
                <div className="flex items-center gap-3" ref={menuRef}>
                    {/* Drafts Button */}
                    <button
                        onClick={() => navigate("/drafts")}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Drafts
                    </button>

                    {/* Create Post Button */}
                    <button
                        onClick={() => navigate("/create")}
                        className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        Create Post
                    </button>

                    {/* Avatar button */}
                    <button
                        aria-haspopup="menu"
                        aria-expanded={open}
                        onClick={() => setOpen((v) => !v)}
                        className="h-9 w-9 rounded-full border border-slate-300 bg-slate-100 flex items-center justify-center hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {initials ? (
                            <span className="text-xs font-semibold text-slate-700">{initials}</span>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 fill-slate-600">
                                <path d="M12 12c2.761 0 5-2.69 5-6s-2.239-6-5-6-5 2.69-5 6 2.239 6 5 6zm0 2c-4.418 0-8 2.91-8 6.5V22h16v-1.5c0-3.59-3.582-6.5-8-6.5z"/>
                            </svg>
                        )}
                    </button>

                    {/* Dropdown menu */}
                    {open && (
                        <div
                            role="menu"
                            className="absolute right-4 top-14 w-44 rounded-xl border border-slate-200 bg-white shadow-lg py-1"
                        >
                            <div className="px-3 py-2 text-xs text-slate-500">Signed in</div>
                            <button
                                onClick={() => { setOpen(false); navigate("/"); }}
                                className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                role="menuitem"
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => { setOpen(false); onLogout?.(); }}
                                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                role="menuitem"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
