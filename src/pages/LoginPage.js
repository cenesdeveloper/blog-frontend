import LoginForm from "../components/LoginForm";

function LoginPage({ onLogin }) {
    return (
        <div>
            <h2>Login</h2>
            <LoginForm onLogin={onLogin} />
        </div>
    );
}

export default LoginPage;
