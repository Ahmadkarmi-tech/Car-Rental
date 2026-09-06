import Header from "./Header";

function History({
    userEmail,
    isAdmin,
    history,
    setUserEmail,
    cars,
    setCars
}) {
    const selectedHistory =
        isAdmin
            ? history
            : history.filter(
                (hist) =>
                    hist.Email === userEmail
            );

    return (
        <div className="Car-Rental">

            <div className="container">

                <Header
                    userEmail={userEmail}
                    isAdmin={isAdmin}
                    setUserEmail={
                        setUserEmail
                    }
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
                                                hist.id
                                            }
                                        >

                                            <td>
                                                {
                                                    hist.id
                                                }
                                            </td>

                                            <td>
                                                {
                                                    hist.carID
                                                }
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
                                                    hist.Total
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
