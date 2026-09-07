import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence
} from "firebase/auth";
import { auth } from "./firebase";

function LoginPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            alert("Please fill in all fields.");
            return;
        }

        setLoading(true);

        try {
            const persistence = formData.rememberMe
                ? browserLocalPersistence
                : browserSessionPersistence;

            await setPersistence(auth, persistence);

            await signInWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            navigate("/");
        } catch (error) {
            console.error(error);

            if (
                error.code === "auth/invalid-credential" ||
                error.code === "auth/user-not-found" ||
                error.code === "auth/wrong-password"
            ) {
                alert("Wrong email or password!");
            } else {
                alert("Failed to login.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">

                <h2>Login</h2>

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">
                        <label htmlFor="email">
                            Email:
                        </label>

                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Enter your email..."
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            Password:
                        </label>

                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Enter your password..."
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="RememberMe">
                        <label htmlFor="rememberMe">
                            Remember me:
                        </label>

                        <input
                            type="checkbox"
                            name="rememberMe"
                            id="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        id="login-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

                <h6>
                    If you don't have an account,
                    make one here{" "}
                    <Link to="/Signup">
                        Sign up
                    </Link>
                </h6>

            </div>
        </div>
    );
}

export default LoginPage;
