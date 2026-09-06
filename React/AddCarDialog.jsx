import {
    useEffect,
    useRef,
    useState
} from "react";

function AddCarDialog({
    isOpen,
    onClose,
    cars,
    setCars,
    isAdd,
    selectedCar
}) {
    const dialogRef =
        useRef(null);

    const [
        formData,
        setFormData
    ] = useState({
        brand: "",
        model: "",
        year: "",
        type: "",
        transmission: "",
        fuel: "",
        seats: "",
        doors: "",
        pricePerDay: "",
        location: "",
        available: true,
        mileage: "",
        image: ""
    });

    const [
        loading,
        setLoading
    ] = useState(false);

    useEffect(() => {

        if (isOpen) {

            if (
                !isAdd &&
                selectedCar
            ) {

                setFormData({
                    brand:
                        selectedCar.brand ||
                        "",
                    model:
                        selectedCar.model ||
                        "",
                    year:
                        selectedCar.year ||
                        "",
                    type:
                        selectedCar.type ||
                        "",
                    transmission:
                        selectedCar.transmission ||
                        "",
                    fuel:
                        selectedCar.fuel ||
                        "",
                    seats:
                        selectedCar.seats ||
                        "",
                    doors:
                        selectedCar.doors ||
                        "",
                    pricePerDay:
                        selectedCar.pricePerDay ||
                        "",
                    location:
                        selectedCar.location ||
                        "",
                    available:
                        selectedCar.available ??
                        true,
                    mileage:
                        selectedCar.mileage ||
                        "",
                    image:
                        selectedCar.image ||
                        ""
                });

            } else {

                setFormData({
                    brand: "",
                    model: "",
                    year: "",
                    type: "",
                    transmission: "",
                    fuel: "",
                    seats: "",
                    doors: "",
                    pricePerDay: "",
                    location: "",
                    available: true,
                    mileage: "",
                    image: ""
                });

            }

            if (
                dialogRef.current &&
                !dialogRef.current.open
            ) {
                dialogRef.current.showModal();
            }

        } else {

            if (
                dialogRef.current &&
                dialogRef.current.open
            ) {
                dialogRef.current.close();
            }

        }

    }, [
        isOpen,
        isAdd,
        selectedCar
    ]);

    function handleChange(e) {

        const {
            name,
            value,
            type,
            files
        } = e.target;

        if (
            type === "file"
        ) {

            const file =
                files[0];

            if (!file) {
                return;
            }

            const reader =
                new FileReader();

            reader.onload = () => {

                setFormData(
                    (prev) => ({
                        ...prev,
                        image:
                            reader.result
                    })
                );

            };

            reader.readAsDataURL(
                file
            );

            return;
        }

        setFormData(
            (prev) => ({
                ...prev,
                [name]: value
            })
        );
    }

    function handleFormSubmit(e) {

        e.preventDefault();

        const requiredFields = [
            "brand",
            "model",
            "year",
            "type",
            "transmission",
            "fuel",
            "seats",
            "doors",
            "pricePerDay",
            "location",
            "mileage",
            "image"
        ];

        const isFormComplete =
            requiredFields.every(
                (field) =>
                    formData[field] !== ""
            );

        if (!isFormComplete) {
            alert(
                "Please fill in all fields."
            );
            return;
        }

        setLoading(true);

        try {

            if (isAdd) {

                const newCar = {
                    id:
                        Date.now().toString(),
                    brand:
                        formData.brand,
                    model:
                        formData.model,
                    year:
                        Number(
                            formData.year
                        ),
                    type:
                        formData.type,
                    transmission:
                        formData.transmission,
                    fuel:
                        formData.fuel,
                    seats:
                        Number(
                            formData.seats
                        ),
                    doors:
                        Number(
                            formData.doors
                        ),
                    pricePerDay:
                        Number(
                            formData.pricePerDay
                        ),
                    location:
                        formData.location,
                    available:
                        true,
                    mileage:
                        Number(
                            formData.mileage
                        ),
                    image:
                        formData.image
                };

                setCars(
                    (prevCars) => [
                        ...prevCars,
                        newCar
                    ]
                );

                alert(
                    "Car added successfully!"
                );

            } else {

                const updatedCar = {
                    id:
                        selectedCar.id,
                    brand:
                        formData.brand,
                    model:
                        formData.model,
                    year:
                        Number(
                            formData.year
                        ),
                    type:
                        formData.type,
                    transmission:
                        formData.transmission,
                    fuel:
                        formData.fuel,
                    seats:
                        Number(
                            formData.seats
                        ),
                    doors:
                        Number(
                            formData.doors
                        ),
                    pricePerDay:
                        Number(
                            formData.pricePerDay
                        ),
                    location:
                        formData.location,
                    available:
                        selectedCar.available,
                    mileage:
                        Number(
                            formData.mileage
                        ),
                    image:
                        formData.image
                };

                setCars(
                    (prevCars) =>
                        prevCars.map(
                            (car) =>
                                car.id ===
                                selectedCar.id
                                    ? updatedCar
                                    : car
                        )
                );

                alert(
                    "Car updated successfully!"
                );
            }

            onClose();

        } catch (error) {

            console.error(
                "Error saving car:",
                error
            );

            alert(
                "Failed to save the car."
            );

        } finally {

            setLoading(false);

        }
    }

    return (

        <dialog
            ref={dialogRef}
            className="addCarDialog"
        >

            <button
                type="button"
                className="close-dialog"
                onClick={onClose}
            >
                ×
            </button>

            <div className="addCarContainer">

                <h2>
                    {isAdd
                        ? "Add New Car"
                        : "Edit Car"}
                </h2>

                <form
                    className="add-car-form"
                    onSubmit={
                        handleFormSubmit
                    }
                >

                    <div className="car-column">

                        <div className="car-field">

                            <label htmlFor="brand">
                                Brand
                            </label>

                            <input
                                id="brand"
                                name="brand"
                                type="text"
                                placeholder="e.g. Range Rover"
                                value={
                                    formData.brand
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                        <div className="car-field">

                            <label htmlFor="model">
                                Model
                            </label>

                            <input
                                id="model"
                                name="model"
                                type="text"
                                placeholder="e.g. Sport"
                                value={
                                    formData.model
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                        <div className="car-field">

                            <label htmlFor="year">
                                Year
                            </label>

                            <input
                                id="year"
                                name="year"
                                type="number"
                                min="1900"
                                max="2100"
                                placeholder="e.g. 2024"
                                value={
                                    formData.year
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                        <div className="car-field">

                            <label htmlFor="type">
                                Type
                            </label>

                            <input
                                id="type"
                                name="type"
                                type="text"
                                placeholder="e.g. Luxury SUV"
                                value={
                                    formData.type
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                        <div className="car-field">

                            <label htmlFor="transmission">
                                Transmission
                            </label>

                            <input
                                id="transmission"
                                name="transmission"
                                type="text"
                                placeholder="e.g. Automatic"
                                value={
                                    formData.transmission
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                        <div className="car-field">

                            <label htmlFor="fuel">
                                Fuel
                            </label>

                            <input
                                id="fuel"
                                name="fuel"
                                type="text"
                                placeholder="e.g. Gasoline"
                                value={
                                    formData.fuel
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                    </div>

                    <div className="car-column">

                        <div className="car-field">

                            <label htmlFor="seats">
                                Seats
                            </label>

                            <input
                                id="seats"
                                name="seats"
                                type="number"
                                min="1"
                                max="20"
                                placeholder="e.g. 5"
                                value={
                                    formData.seats
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                        <div className="car-field">

                            <label htmlFor="doors">
                                Doors
                            </label>

                            <input
                                id="doors"
                                name="doors"
                                type="number"
                                min="1"
                                max="10"
                                placeholder="e.g. 4"
                                value={
                                    formData.doors
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                        <div className="car-field">

                            <label htmlFor="pricePerDay">
                                Price Per Day
                            </label>

                            <input
                                id="pricePerDay"
                                name="pricePerDay"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="e.g. 180"
                                value={
                                    formData.pricePerDay
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                        <div className="car-field">

                            <label htmlFor="location">
                                Location
                            </label>

                            <input
                                id="location"
                                name="location"
                                type="text"
                                placeholder="e.g. New York"
                                value={
                                    formData.location
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                        <div className="car-field">

                            <label htmlFor="mileage">
                                Mileage
                            </label>

                            <input
                                id="mileage"
                                name="mileage"
                                type="number"
                                min="0"
                                placeholder="e.g. 5100"
                                value={
                                    formData.mileage
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                        <div className="car-field">

                            <label htmlFor="image">
                                Car Image
                            </label>

                            <label
                                className="image-drop-zone"
                                htmlFor="image"
                            >

                                <span>
                                    📷
                                </span>

                                <strong>
                                    {formData.image
                                        ? "Image selected"
                                        : "Choose image..."}
                                </strong>

                                <input
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={
                                        handleChange
                                    }
                                />

                            </label>

                        </div>

                    </div>

                    <button
                        type="submit"
                        className="add-car-submit"
                        disabled={
                            loading
                        }
                    >
                        {loading
                            ? "Saving..."
                            : isAdd
                                ? "Add Car"
                                : "Save Changes"}
                    </button>

                </form>

            </div>

        </dialog>
    );
}

export default AddCarDialog;
