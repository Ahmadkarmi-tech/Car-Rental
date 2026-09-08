import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    createUserWithEmailAndPassword,
    signOut
} from "firebase/auth";
import {
    doc,
    setDoc
} from "firebase/firestore";
import { auth, db } from "../services/firebase";

function SignupPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        dateOfBirth: "",
        licenseNumber: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const clearForm = () => {
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",
            dateOfBirth: "",
            licenseNumber: ""
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isFormComplete = Object.values(formData).every(
            (value) => value.trim() !== ""
        );

        if (!isFormComplete) {
            alert("Please fill in all fields.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        const today = new Date();
        const inputDate = new Date(formData.dateOfBirth);

        today.setHours(0, 0, 0, 0);
        inputDate.setHours(0, 0, 0, 0);

        if (inputDate > today) {
            alert("The date of birth is invalid!");
            return;
        }

        const minimumBirthDate = new Date(
            today.getFullYear() - 18,
            today.getMonth(),
            today.getDate()
        );

        if (inputDate > minimumBirthDate) {
            alert(
                "You must be 18 years or older to create an account."
            );
            return;
        }

        setLoading(true);

        try {
            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    formData.email.trim(),
                    formData.password
                );

            const user = userCredential.user;

            await setDoc(
                doc(db, "users", user.uid),
                {
                    uid: user.uid,
                    firstName: formData.firstName.trim(),
                    lastName: formData.lastName.trim(),
                    email: formData.email.trim(),
                    phoneNumber: formData.phoneNumber.trim(),
                    dateOfBirth: formData.dateOfBirth,
                    licenseNumber: formData.licenseNumber.trim()
                }
            );

            clearForm();

            await signOut(auth);

            alert("Account created successfully!");

            navigate("/Login", {
                replace: true
            });
        } catch (error) {
            console.error("Signup error:", error);

            if (error.code === "auth/email-already-in-use") {
                alert("Email is already in use.");
            } else if (error.code === "auth/invalid-email") {
                alert("Please enter a valid email address.");
            } else if (error.code === "auth/weak-password") {
                alert("Password is too weak.");
            } else if (error.code === "permission-denied") {
                alert(
                    "Account was created, but Firestore permission was denied."
                );
            } else {
                alert(
                    `Failed to create account: ${error.message}`
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">

                <h2>Signup</h2>

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">
                        <label htmlFor="firstName">
                            First Name:
                        </label>

                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            placeholder="Enter your first name..."
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">
                            Last Name:
                        </label>

                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            placeholder="Enter your last name..."
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    </div>

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
                        <label htmlFor="phoneNumber">
                            Phone Number:
                        </label>

                        <input
                            type="tel"
                            name="phoneNumber"
                            id="phoneNumber"
                            placeholder="Enter your phone number..."
                            value={formData.phoneNumber}
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

                    <div className="form-group">
                        <label htmlFor="confirmPassword">
                            Confirm Password:
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            placeholder="Enter your password again..."
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="dateOfBirth">
                            Date of Birth:
                        </label>

                        <input
                            type="date"
                            name="dateOfBirth"
                            id="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="licenseNumber">
                            Driver's License Number:
                        </label>

                        <input
                            type="text"
                            name="licenseNumber"
                            id="licenseNumber"
                            placeholder="Enter your license number..."
                            value={formData.licenseNumber}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        id="login-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Signup"}
                    </button>

                    <h6>
                        Already have an account?{" "}
                        <Link to="/Login">
                            Login
                        </Link>
                    </h6>

                </form>

            </div>
        </div>
    );
}

export default SignupPage;