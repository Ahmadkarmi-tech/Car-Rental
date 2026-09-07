import { useRef, useState } from "react";
import Header from "./Header";
import AddCarDialog from "./AddCarDialog";

import {collection,doc,runTransaction} from "firebase/firestore";

import { db } from "./firebase";

function HomePage({user,userData,isAdmin,history,cars,setCars, carsLoading}) {
    const [selectedCar, setSelectedCar] = useState(null);

    const [formData, setFormData] = useState({
        FromDate: "",
        ToDate: "",
        TotalCount: ""
    });

    const dialogRef = useRef(null);
    const rentDialogRef = useRef(null);

    const [isAddCarOpen, setIsAddCarOpen] =
        useState(false);

    function handleCardClick(car) {
        setSelectedCar(car);

        if (dialogRef.current && !dialogRef.current.open
        ) {
            dialogRef.current.showModal();
        }
    }

    function closeDialog() {
        if (dialogRef.current && dialogRef.current.open) {
            dialogRef.current.close();
        }

        setSelectedCar(null);
    }

    function handleRentClick() {
        if (dialogRef.current && dialogRef.current.open) {
            dialogRef.current.close();
        }

        if (rentDialogRef.current && !rentDialogRef.current.open) {
            rentDialogRef.current.showModal();
        }
    }

    function handleRentClose() {
        if (rentDialogRef.current && rentDialogRef.current.open) {
            rentDialogRef.current.close();
        }

        setFormData({
            FromDate: "",
            ToDate: "",
            TotalCount: ""
        });
    }

    function handleChange(e) {
        const {name,value} = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    function calculateTotalPrice() {
        if (!formData.FromDate || !formData.ToDate ||!selectedCar) {
            return "";
        }

        const fromDate = new Date(formData.FromDate);

        const toDate = new Date(formData.ToDate);

        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(0, 0, 0, 0);

        if (toDate < fromDate) {
            return "";
        }

        const days = Math.max(1,Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)));

        return (days * Number(selectedCar.pricePerDay));
    }

    async function getNextHistoryId() {
        const counterRef = doc(
            db,
            "counters",
            "history"
        );

        const nextId =
            await runTransaction(
                db,
                async (transaction) => {
                    const counterSnapshot =
                        await transaction.get(
                            counterRef
                        );

                    const currentId =
                        counterSnapshot.exists()
                            ? Number(
                                counterSnapshot
                                    .data()
                                    .nextId
                            ) || 1
                            : 1;

                    transaction.set(
                        counterRef,
                        {
                            nextId:
                                currentId + 1
                        },
                        {
                            merge: true
                        }
                    );

                    return currentId;
                }
            );

        return nextId;
    }

    async function handleRentSubmit(e) {
        e.preventDefault();

        if (!formData.FromDate || !formData.ToDate
        ) {
            alert("You should fill all the fields!");
            return;
        }

        const today = new Date();

        const FromDate = new Date(formData.FromDate);

        const ToDate = new Date(formData.ToDate);

        today.setHours(0, 0, 0, 0);
        FromDate.setHours(0, 0, 0, 0);
        ToDate.setHours(0, 0, 0, 0);

        if (FromDate < today) {
            alert("The starting date cannot be in the past!");
            return;
        }

        if (ToDate < FromDate) {
            alert("The return date cannot be before the starting date!");
            return;
        }

        if (!selectedCar) {
            return;
        }

        if (!user) {
            alert("You must be logged in to rent a car.");
            return;
        }

        if (!selectedCar.available) {
            alert("This car is currently rented.");
            return;
        }

        try {
            const historyId =
                await getNextHistoryId();

            const totalPrice =
                calculateTotalPrice();

            const historyRef = doc(
                collection(
                    db,
                    "history"
                )
            );

            const carDocumentId =
                selectedCar.firebaseId;

            if (!carDocumentId) {
                throw new Error(
                    "Car document ID is missing."
                );
            }

            const carRef = doc(
                db,
                "cars",
                carDocumentId
            );

            const newHistory = {
                id: historyId,
                carID: Number(
                    selectedCar.id
                ),
                FromDate:
                    formData.FromDate,
                ToDate:
                    formData.ToDate,
                Total: Number(
                    totalPrice
                ),
                Email:
                    user.email,
                uid:
                    user.uid
            };

            await runTransaction(
                db,
                async (transaction) => {
                    const carSnapshot =
                        await transaction.get(
                            carRef
                        );

                    if (
                        !carSnapshot.exists()
                    ) {
                        throw new Error(
                            "Car no longer exists."
                        );
                    }

                    const currentCar =
                        carSnapshot.data();

                    if (currentCar.available === false) {
                        throw new Error(
                            "This car has already been rented."
                        );
                    }

                    transaction.set(
                        historyRef,
                        newHistory
                    );

                    transaction.update(
                        carRef,
                        {
                            available:
                                false
                        }
                    );
                }
            );

            setCars(
                (prevCars) =>
                    prevCars.map(
                        (car) =>
                            car.firebaseId ===
                            carDocumentId
                                ? {
                                    ...car,
                                    available:
                                        false
                                }
                                : car
                    )
            );

            alert("Car rented successfully!");

            handleRentClose();
            setSelectedCar(null);

        } catch (error) {
            console.error(
                "Rental error:",
                error
            );

            alert(`Failed to rent the car: ${error.message}`);
        }
    }

    async function handleRemoveClick() {
        if (!selectedCar) {
            return;
        }

        const userConfirmed =
            window.confirm(
                "Are you sure you want to delete this item?"
            );

        if (!userConfirmed) {
            return;
        }

        const carDocumentId =
            selectedCar.firebaseId;

        if (!carDocumentId) {
            alert("Car document ID is missing.");
            return;
        }

        try {
            const carRef = doc(
                db,
                "cars",
                carDocumentId
            );

            await runTransaction(
                db,
                async (transaction) => {
                    transaction.delete(
                        carRef
                    );
                }
            );

            setCars(
                (prevCars) =>
                    prevCars.filter(
                        (car) =>
                            car.firebaseId !==
                            carDocumentId
                    )
            );

            closeDialog();

            alert("Car removed successfully!");

        } catch (error) {
            console.error(
                "Error removing car:",
                error
            );

            alert(`Failed to remove car: ${error.message}`);
        }
    }

    function handleEditCarOpen() {
        if (
            dialogRef.current &&
            dialogRef.current.open
        ) {
            dialogRef.current.close();
        }

        setIsAddCarOpen(true);
    }

    function handleEditCarClose() {
        setIsAddCarOpen(false);
        setSelectedCar(null);
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

                    {carsLoading ? (

                        <div className="cars-loading">
                            <div className="loader"></div>

                            <h2>
                                Loading cars...
                            </h2>

                            <p>
                                Please wait while
                                we load all cars.
                            </p>
                        </div>

                    ) : cars.length === 0 ? (

                        <div className="cars-loading">
                            <h2>
                                No cars available
                            </h2>

                            {isAdmin && (
                                <p>
                                    Add a new car
                                    to get started.
                                </p>
                            )}
                        </div>

                    ) : (

                        <ul className="grid">

                            {cars.map((car) => {

                                const status =
                                    car.available
                                        ? "available"
                                        : "rented";

                                return (
                                    <li
                                        key={
                                            car.firebaseId
                                        }
                                        className={
                                            `card ${status}`
                                        }
                                        onClick={() =>
                                            handleCardClick(
                                                car
                                            )
                                        }
                                    >

                                        <img
                                            src={
                                                car.image
                                            }
                                            alt={
                                                `${car.brand} ${car.model}`
                                            }
                                        />

                                        <h3>
                                            {
                                                car.brand
                                            }{" "}
                                            {
                                                car.model
                                            }
                                        </h3>

                                        <p>
                                            {
                                                car.year
                                            }{" "}
                                            •{" "}
                                            {
                                                car.type
                                            }
                                        </p>

                                        <p>
                                            {
                                                car.transmission
                                            }{" "}
                                            •{" "}
                                            {
                                                car.fuel
                                            }
                                        </p>

                                        <p>
                                            $
                                            {
                                                car.pricePerDay
                                            }{" "}
                                            / day
                                        </p>

                                        <span className="status">
                                            {
                                                car.available
                                                    ? "Available"
                                                    : "Rented"
                                            }
                                        </span>

                                    </li>
                                );
                            })}

                        </ul>
                    )}

                    <dialog
                        ref={dialogRef}
                        className="car-dialog"
                    >

                        {selectedCar && (
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
                        )}

                    </dialog>

                    <dialog
                        ref={rentDialogRef}
                        className="rent-dialog"
                    >

                        <button
                            type="button"
                            className="close-dialog"
                            onClick={
                                handleRentClose
                            }
                        >
                            ×
                        </button>

                        <h1>
                            Rent a Car
                        </h1>

                        <form
                            onSubmit={
                                handleRentSubmit
                            }
                        >

                            <div className="form-content">

                                <label htmlFor="FromDate">
                                    From
                                </label>

                                <label htmlFor="TotalCount">
                                    Total price
                                </label>

                            </div>

                            <div className="form-content">

                                <input
                                    name="FromDate"
                                    id="FromDate"
                                    type="date"
                                    value={
                                        formData.FromDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                                <input
                                    name="TotalCount"
                                    id="TotalCount"
                                    type="number"
                                    value={
                                        calculateTotalPrice()
                                    }
                                    readOnly
                                    tabIndex={-1}
                                    placeholder="Price..."
                                />

                            </div>

                            <div className="form-content">

                                <label htmlFor="ToDate">
                                    To
                                </label>

                            </div>

                            <div className="form-content">

                                <input
                                    name="ToDate"
                                    id="ToDate"
                                    type="date"
                                    value={
                                        formData.ToDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>

                            <button
                                type="submit"
                                className="RentButton"
                            >
                                Rent
                            </button>

                        </form>

                    </dialog>

                    <AddCarDialog
                        isOpen={
                            isAddCarOpen
                        }
                        onClose={
                            handleEditCarClose
                        }
                        cars={cars}
                        setCars={setCars}
                        isAdd={false}
                        selectedCar={
                            selectedCar
                        }
                    />

                </div>

            </div>

        </div>
    );
}

export default HomePage;
