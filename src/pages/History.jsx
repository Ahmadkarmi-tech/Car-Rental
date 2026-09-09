import {
    useOutletContext
} from "react-router-dom";


function History() {

    const {
        user,
        isAdmin,
        cars,
        history,
        historyLoading
    } = useOutletContext();


    const userHistory =
        isAdmin
            ? history
            : history.filter(
                (item) =>
                    item.uid ===
                    user?.uid
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


    if (historyLoading) {

        return (
            <div className="history-loading">

                <div className="loader"></div>

                <h2>
                    Loading history...
                </h2>

                <p>
                    Please wait while
                    we load your rental history.
                </p>

            </div>
        );
    }


    return (
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
    );
}


export default History;
