import { useEffect, useState } from "react";

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


function History() {

    const [user, setUser] = useState(null);

    const [userData, setUserData] =
        useState(null);

    const [cars, setCars] = useState([]);

    const [history, setHistory] =
        useState([]);

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        const unsubscribe =
            onAuthStateChanged(
                auth,
                (currentUser) => {
                    setUser(currentUser);
                    setLoading(false);
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
            return;
        }

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
                },
                (error) => {

                    console.error(
                        "Error loading cars:",
                        error
                    );

                }
            );

        return unsubscribe;

    }, [user]);


    useEffect(() => {

        if (!user) {
            setHistory([]);
            return;
        }

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


    const userHistory =
        isAdmin
            ? history
            : history.filter(
                (item) =>
                    item.uid === user?.uid
            );


    function getCar(carID) {

        const car =
            cars.find(
                (item) =>
                    Number(item.id) ===
                    Number(carID)
            );

        if (!car) {
            return `Car #${carID}`;
        }

        return `${car.brand} ${car.model}`;
    }


    if (loading) {

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

                        <div className="cars-loading">

                            <div className="loader"></div>

                            <h2>
                                Loading history...
                            </h2>

                            <p>
                                Please wait while
                                we load your history.
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

                    <table className="history-table">

                        <caption>
                            Rental History
                        </caption>

                        <thead>

                            <tr>

                                <th>
                                    ID
                                </th>

                                <th>
                                    Car
                                </th>

                                <th>
                                    From
                                </th>

                                <th>
                                    To
                                </th>

                                <th>
                                    Total
                                </th>

                                {isAdmin && (
                                    <th>
                                        Email
                                    </th>
                                )}

                            </tr>

                        </thead>

                        <tbody>

                            {userHistory.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={
                                            isAdmin
                                                ? 6
                                                : 5
                                        }
                                        style={{
                                            textAlign:
                                                "center"
                                        }}
                                    >
                                        No rental
                                        history found.
                                    </td>

                                </tr>

                            ) : (

                                userHistory.map(
                                    (item) => (

                                        <tr
                                            key={
                                                item.firebaseId
                                            }
                                        >

                                            <td>
                                                {item.id}
                                            </td>

                                            <td>
                                                {
                                                    getCar(
                                                        item.carID
                                                    )
                                                }
                                            </td>

                                            <td>
                                                {
                                                    item.FromDate
                                                }
                                            </td>

                                            <td>
                                                {
                                                    item.ToDate
                                                }
                                            </td>

                                            <td>
                                                $
                                                {
                                                    Number(
                                                        item.Total
                                                    ).toFixed(2)
                                                }
                                            </td>

                                            {isAdmin && (
                                                <td>
                                                    {
                                                        item.Email
                                                    }
                                                </td>
                                            )}

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}


export default History;
