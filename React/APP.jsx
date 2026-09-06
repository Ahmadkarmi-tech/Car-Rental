import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import HomePage from "./HomePage";
import History from "./History";
import ProtectedRoute from "./ProtectedRoute";

import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";

import { useEffect, useState } from "react";

function App() {
    const [userEmail, setUserEmail] = useState("");
    const [cars, setCars] = useState([]);
    const [history, setHistoryData] = useState([]);
    const savedEmail = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");

    useEffect(() => {

        if (savedEmail) {
            setUserEmail(savedEmail);
        }

        const savedCars =
            localStorage.getItem("Cars");

        const savedHistory =
            localStorage.getItem("History");

        if (savedCars) {
            try {
                setCars(JSON.parse(savedCars));
            } catch (error) {
                console.error(
                    "Error loading Cars:",
                    error
                );

                localStorage.removeItem("Cars");
            }
        }

        if (savedHistory) {
            try {
                setHistoryData(
                    JSON.parse(savedHistory)
                );
            } catch (error) {
                console.error(
                    "Error loading History:",
                    error
                );

                localStorage.removeItem("History");
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(
            "Cars",
            JSON.stringify(cars)
        );
    }, [cars]);

    useEffect(() => {
        localStorage.setItem(
            "History",
            JSON.stringify(history)
        );
    }, [history]);

    const isAdmin =
        userEmail === "Admin@gmail.com";

    const router =
        createBrowserRouter([
            {
                path: "/",

                element: (
                    <ProtectedRoute
                        userEmail={savedEmail}
                    >
                        <HomePage
                            userEmail={userEmail}
                            isAdmin={isAdmin}
                            history={history}
                            setHistoryData={
                                setHistoryData
                            }
                            setUserEmail={
                                setUserEmail
                            }
                            cars={cars}
                            setCars={setCars}
                        />
                    </ProtectedRoute>
                )
            },

            {
                path: "/History",

                element: (
                    <ProtectedRoute
                        userEmail={savedEmail}
                    >
                        <History
                            userEmail={userEmail}
                            isAdmin={isAdmin}
                            history={history}
                            setUserEmail={
                                setUserEmail
                            }
                            cars={cars}
                            setCars={setCars}
                        />
                    </ProtectedRoute>
                )
            },

            {
                path: "/Login",

                element: (
                    <LoginPage
                        setUserEmail={
                            setUserEmail
                        }
                    />
                )
            },

            {
                path: "/Signup",

                element: (
                    <SignupPage />
                )
            }
        ]);

    return (
        <RouterProvider
            router={router}
        />
    );
}

export default App;
