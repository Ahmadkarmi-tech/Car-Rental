function CarCard({ closeDialog, selectedCar, handleEditCarOpen, handleRemoveClick, handleRentClick, isAdmin }) {
    return (
        <>

            <button
                type="button"
                className="close-dialog"
                onClick={
                    closeDialog
                }
            >
                ×
            </button>

            <img
                src={
                    selectedCar.image
                }
                alt={
                    `${selectedCar.brand} ${selectedCar.model}`
                }
            />

            <h2>
                {
                    selectedCar.brand
                }{" "}
                {
                    selectedCar.model
                }
            </h2>

            <p>
                {
                    selectedCar.year
                }{" "}
                •{" "}
                {
                    selectedCar.type
                }
            </p>

            <div className="car-details">

                <p>
                    <strong>
                        Transmission:
                    </strong>{" "}
                    {
                        selectedCar.transmission
                    }
                </p>

                <p>
                    <strong>
                        Fuel:
                    </strong>{" "}
                    {
                        selectedCar.fuel
                    }
                </p>

                <p>
                    <strong>
                        Seats:
                    </strong>{" "}
                    {
                        selectedCar.seats
                    }
                </p>

                <p>
                    <strong>
                        Doors:
                    </strong>{" "}
                    {
                        selectedCar.doors
                    }
                </p>

                <p>
                    <strong>
                        Mileage:
                    </strong>{" "}
                    {
                        Number(
                            selectedCar.mileage
                        ).toLocaleString()
                    }{" "}
                    km
                </p>

                <p>
                    <strong>
                        Location:
                    </strong>{" "}
                    {
                        selectedCar.location
                    }
                </p>

            </div>

            <h3>
                $
                {
                    selectedCar.pricePerDay
                }{" "}
                / day
            </h3>

            <button
                type="button"
                className="rent-button"
                disabled={
                    !selectedCar.available
                }
                onClick={
                    handleRentClick
                }
            >
                {
                    selectedCar.available
                        ? "Rent This Car"
                        : "Currently Rented"
                }
            </button>

            {isAdmin && (

                <>

                    <button
                        type="button"
                        className="edit-button"
                        onClick={
                            handleEditCarOpen
                        }
                    >
                        Edit This Car
                    </button>

                    <button
                        type="button"
                        className="remove-button"
                        onClick={
                            handleRemoveClick
                        }
                    >
                        Remove This Car
                    </button>

                </>

            )}

        </>
    )
}
export default CarCard;