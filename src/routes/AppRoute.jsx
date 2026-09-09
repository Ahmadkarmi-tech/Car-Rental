import { useEffect, useState } from "react";

import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import HomePage from "../pages/HomePage";
import History from "../pages/History";

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../Layout/MainLayout";

import {
    onAuthStateChanged
} from "firebase/auth";

import {
    auth
} from "../services/firebase";


function AppRoute() {

    const [user, setUser] = useState(null);

    const [authLoading, setAuthLoading] =
        useState(true);


    useEffect(() => {

        const unsubscribe =
            onAuthStateChanged(
                auth,
                (currentUser) => {

                    setUser(currentUser);
                    setAuthLoading(false);
                }
            );

        return unsubscribe;

    }, []);


    const router =
        createBrowserRouter([

            {
                element: (
                    <ProtectedRoute
                        user={user}
                        loading={authLoading}
                    >
                        <MainLayout />
                    </ProtectedRoute>
                ),

                children: [

                    {
                        path: "/",
                        element: <HomePage />
                    },

                    {
                        path: "/History",
                        element: <History />
                    }

                ]
            },

            {
                path: "/Login",
                element: <LoginPage />
            },

            {
                path: "/Signup",
                element: <SignupPage />
            }

        ]);


    return (
        <RouterProvider
            router={router}
        />
    );
}


export default AppRoute;
