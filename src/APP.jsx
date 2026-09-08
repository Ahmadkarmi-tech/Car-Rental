import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import History from "./pages/History";
import ProtectedRoute from "./routes/ProtectedRoute";

import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";

import { useEffect, useState } from "react";

import { onAuthStateChanged } from "firebase/auth";
import {
    collection,
    onSnapshot
} from "firebase/firestore";

import { auth, db } from "./services/firebase";

function App() {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);

    const [cars, setCars] = useState([]);
    const [history, setHistoryData] = useState([]);

    const [authLoading, setAuthLoading] = useState(true);
    const [carsLoading, setCarsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            (currentUser) => {
                setUser(currentUser);
                setAuthLoading(false);
            }
        );

        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!user) {
            setUserData(null);
            return;
        }

        const unsubscribe = onSnapshot(
            collection(db, "users"),
            (snapshot) => {
                const users = snapshot.docs.map(
                    (doc) => ({
                        id: doc.id,
                        ...doc.data()
                    })
                );

                const currentUser = users.find(
                    (item) =>
                        item.uid === user.uid
                );

                setUserData(
                    currentUser || null
                );
            },
            (error) => {
                console.error(
                    "Error loading users:",
                    error
                );
            }
        );

        return unsubscribe;
    }, [user]);

    useEffect(() => {
        if (!user) {
            setCars([]);
            setCarsLoading(false);
            return;
        }

        setCarsLoading(true);

        const unsubscribe = onSnapshot(
            collection(db, "cars"),
            (snapshot) => {
                const carData =
                    snapshot.docs.map(
                        (doc) => ({
                            ...doc.data(),
                            firebaseId: doc.id
                        })
                    );

                setCars(carData);
                setCarsLoading(false);
            },
            (error) => {
                console.error(
                    "Error loading cars:",
                    error
                );

                setCarsLoading(false);
            }
        );

        return unsubscribe;
    }, [user]);

    useEffect(() => {
        if (!user) {
            setHistoryData([]);
            return;
        }

        const unsubscribe = onSnapshot(
            collection(db, "history"),
            (snapshot) => {
                const historyData =
                    snapshot.docs.map(
                        (doc) => ({
                            ...doc.data(),
                            firebaseId: doc.id
                        })
                    );

                setHistoryData(
                    historyData
                );
            },
            (error) => {
                console.error(
                    "Error loading history:",
                    error
                );
            }
        );

        return unsubscribe;
    }, [user]);

    const isAdmin =
        user?.email?.toLowerCase() ===
        "admin@gmail.com";

    const router =
        createBrowserRouter([
            {
                path: "/",

                element: (
                    <ProtectedRoute
                        user={user}
                        loading={authLoading}
                    >
                        <HomePage
                            user={user}
                            userData={userData}
                            isAdmin={isAdmin}
                            history={history}
                            cars={cars}
                            setCars={setCars}
                            carsLoading={
                                carsLoading
                            }
                        />
                    </ProtectedRoute>
                )
            },

            {
                path: "/History",

                element: (
                    <ProtectedRoute
                        user={user}
                        loading={authLoading}
                    >
                        <History
                            user={user}
                            userData={userData}
                            isAdmin={isAdmin}
                            history={history}
                            cars={cars}
                            setCars={setCars}
                        />
                    </ProtectedRoute>
                )
            },

            {
                path: "/Login",

                element: (
                    <LoginPage />
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
