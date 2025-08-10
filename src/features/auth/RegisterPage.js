import RegisterForm from "./RegisterForm";

function RegisterPage({ onRegistered, onGoToLogin }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl ring-1 ring-black/5 p-6 sm:p-8">
                    <div className="mb-6 text-center">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Create your account</h2>
                        <p className="mt-1 text-sm text-slate-600">Join to start posting</p>
                    </div>

                    <RegisterForm onRegistered={onRegistered} />

                    <p className="mt-6 text-center text-sm text-slate-600">
                        Already have an account?{" "}
                        <a
                            href="/login"
                            onClick={(e) => {
                                if (onGoToLogin) {
                                    e.preventDefault();
                                    onGoToLogin();
                                }
                            }}
                            className="font-medium text-indigo-600 hover:text-indigo-700"
                        >
                            Sign in
                        </a>
                    </p>
                </div>

                <p className="mt-6 text-center text-xs text-slate-400">© {new Date().getFullYear()} Your App</p>
            </div>
        </div>
    );
}

export default RegisterPage;
