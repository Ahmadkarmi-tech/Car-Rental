function CarsList({ cars, onCardClick }) {
    return (
        <ul className="grid">
            {cars.map((car) => {
                const status = car.available
                    ? "available"
                    : "rented";

                return (
                    <li
                        key={car.firebaseId}
                        className={`card ${status}`}
                        onClick={() => onCardClick(car)}
                    >
                        <img
                            src={car.image}
                            alt={`${car.brand} ${car.model}`}
                        />

                        <h3>
                            {car.brand} {car.model}
                        </h3>

                        <p>
                            {car.year} • {car.type}
                        </p>

                        <p>
                            {car.transmission} • {car.fuel}
                        </p>

                        <p>
                            ${car.pricePerDay} / day
                        </p>

                        <span className="status">
                            {car.available
                                ? "Available"
                                : "Rented"}
                        </span>
                    </li>
                );
            })}
        </ul>
    );
}

export default CarsList;
