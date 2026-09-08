import Header from "../components/Header/Header";

function History({
    user,
    userData,
    isAdmin,
    history,
    cars,
    setCars
}) {
    const selectedHistory =
        isAdmin
            ? history
            : history.filter(
                (hist) =>
                    hist.uid === user?.uid ||
                    hist.Email === user?.email
            );

    function getCarName(carID) {
        const car = cars.find(
            (item) =>
                Number(item.id) ===
                Number(carID)
        );

        if (!car) {
            return `Car ${carID}`;
        }

        return `${car.brand} ${car.model}`;
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
                            Rent History
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

                            </tr>

                        </thead>

                        <tbody>

                            {selectedHistory.length >
                            0 ? (

                                selectedHistory.map(
                                    (hist) => (
                                        <tr
                                            key={
                                                hist.firebaseId ||
                                                hist.id
                                            }
                                        >

                                            <td>
                                                {
                                                    hist.id
                                                }
                                            </td>

                                            <td>
                                                {getCarName(
                                                    hist.carID
                                                )}{" "}
                                                (
                                                {
                                                    hist.carID
                                                }
                                                )
                                            </td>

                                            <td>
                                                {
                                                    hist.FromDate
                                                }
                                            </td>

                                            <td>
                                                {
                                                    hist.ToDate
                                                }
                                            </td>

                                            <td>
                                                $
                                                {
                                                    Number(
                                                        hist.Total
                                                    ).toFixed(
                                                        2
                                                    )
                                                }
                                            </td>

                                        </tr>
                                    )
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan="5"
                                    >
                                        No rental
                                        history
                                        found.
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

export default History;
