import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

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
        const {
            name,
            value
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const isFormComplete =
            Object.values(formData).every(
                (value) => value !== ""
            );

        if (!isFormComplete) {
            alert("Please fill in all fields.");
            return;
        }

        if (
            formData.password !==
            formData.confirmPassword
        ) {
            alert("Passwords do not match.");
            return;
        }

        const today = new Date();
        const inputDate =
            new Date(formData.dateOfBirth);

        today.setHours(0, 0, 0, 0);
        inputDate.setHours(0, 0, 0, 0);

        if (inputDate > today) {
            alert(
                "The date of birth is invalid!"
            );
            return;
        }

        const minimumBirthDate =
            new Date(
                today.getFullYear() - 18,
                today.getMonth(),
                today.getDate()
            );

        if (
            inputDate > minimumBirthDate
        ) {
            alert(
                "You must be 18 years or older to create an account."
            );
            return;
        }

        setLoading(true);

        const savedUsers =
            JSON.parse(
                localStorage.getItem("users")
            ) || [];

        const existingUser =
            savedUsers.find(
                (user) =>
                    user.email ===
                    formData.email
            );

        if (existingUser) {
            alert(
                "Email is already in use."
            );

            setLoading(false);
            return;
        }

        const newUser = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber:
                formData.phoneNumber,
            password: formData.password,
            dateOfBirth:
                formData.dateOfBirth,
            licenseNumber:
                formData.licenseNumber
        };

        savedUsers.push(newUser);

        localStorage.setItem(
            "users",
            JSON.stringify(savedUsers)
        );

        alert(
            "Account created successfully!"
        );

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

        setLoading(false);

        navigate("/Login");
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
                            value={
                                formData.firstName
                            }
                            onChange={
                                handleChange
                            }
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
                            value={
                                formData.lastName
                            }
                            onChange={
                                handleChange
                            }
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
                            value={
                                formData.email
                            }
                            onChange={
                                handleChange
                            }
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
                            value={
                                formData.phoneNumber
                            }
                            onChange={
                                handleChange
                            }
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
                            value={
                                formData.password
                            }
                            onChange={
                                handleChange
                            }
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
                            value={
                                formData.confirmPassword
                            }
                            onChange={
                                handleChange
                            }
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
                            value={
                                formData.dateOfBirth
                            }
                            onChange={
                                handleChange
                            }
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
                            value={
                                formData.licenseNumber
                            }
                            onChange={
                                handleChange
                            }
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
