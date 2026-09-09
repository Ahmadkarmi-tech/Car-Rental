import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/Header/Header";

import {
    collection,
    onSnapshot
} from "firebase/firestore";

import {
    onAuthStateChanged
} from "firebase/auth";

import {
    auth,
    db
} from "../services/firebase";


function MainLayout() {

    const [user, setUser] = useState(null);

    const [userData, setUserData] =
        useState(null);

    const [cars, setCars] =
        useState([]);

    const [carsLoading, setCarsLoading] =
        useState(true);

    const [history, setHistory] =
        useState([]);

    const [historyLoading, setHistoryLoading] =
        useState(true);

    const [userLoading, setUserLoading] =
        useState(true);


    useEffect(() => {

        const unsubscribe =
            onAuthStateChanged(
                auth,
                (currentUser) => {

                    setUser(currentUser);
                    setUserLoading(false);
                }
            );

        return unsubscribe;

    }, []);


    useEffect(() => {

        if (!user) {

            setUserData(null);

            return;
        }

        const unsubscribe =
            onSnapshot(
                collection(db, "users"),
                (snapshot) => {

                    const users =
                        snapshot.docs.map(
                            (doc) => ({
                                id: doc.id,
                                ...doc.data()
                            })
                        );

                    const currentUser =
                        users.find(
                            (item) =>
                                item.uid ===
                                user.uid
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

        const unsubscribe =
            onSnapshot(
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

                    setCars([]);
                    setCarsLoading(false);
                }
            );

        return unsubscribe;

    }, [user]);


    useEffect(() => {

        if (!user) {

            setHistory([]);
            setHistoryLoading(false);

            return;
        }

        setHistoryLoading(true);

        const unsubscribe =
            onSnapshot(
                collection(db, "history"),
                (snapshot) => {

                    const historyData =
                        snapshot.docs
                            .map(
                                (doc) => ({
                                    ...doc.data(),
                                    firebaseId: doc.id
                                })
                            )
                            .sort(
                                (a, b) =>
                                    Number(a.id) -
                                    Number(b.id)
                            );

                    setHistory(historyData);
                    setHistoryLoading(false);
                },
                (error) => {

                    console.error(
                        "Error loading history:",
                        error
                    );

                    setHistory([]);
                    setHistoryLoading(false);
                }
            );

        return unsubscribe;

    }, [user]);


    const isAdmin =
        user?.email?.toLowerCase() ===
        "admin@gmail.com";


    if (userLoading) {

        return (
            <div className="Car-Rental">

                <div className="container">

                    <div className="contents">

                        <div className="cars-loading">

                            <div className="loader"></div>

                            <h2>
                                Loading...
                            </h2>

                            <p>
                                Please wait.
                            </p>

                        </div>

                    </div>

                </div>

            </div>
        );
    }


    return (
        <div className="Car-Rental">

            <div className="container">

                <Header
                    user={user}
                    userData={userData}
                    isAdmin={isAdmin}
                    cars={cars}
                    setCars={setCars}
                />

                <div className="contents">

                    <Outlet
                        context={{
                            user,
                            userData,
                            isAdmin,
                            cars,
                            setCars,
                            carsLoading,
                            history,
                            historyLoading
                        }}
                    />

                </div>

            </div>

        </div>
    );
}


export default MainLayout;
