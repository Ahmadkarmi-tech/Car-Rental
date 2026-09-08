import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import AddCarDialog from "../Cars/AddCarDialog";
import { auth } from "../../services/firebase";
import logo from "../../assets/Images/Logo.webp";
import settingsImage from "../../assets/Images/settings.png"
function Header({
    user,
    userData,
    isAdmin,
    cars,
    setCars
}) {
    const navigate = useNavigate();

    const settingRef = useRef(null);

    const [isSettingOpen, setIsSettingOpen] =
        useState(false);

    const [isAddCarOpen, setIsAddCarOpen] =
        useState(false);

    useEffect(() => {
        if (
            settingRef.current &&
            isSettingOpen &&
            !settingRef.current.open
        ) {
            settingRef.current.showModal();
        }

        if (
            settingRef.current &&
            !isSettingOpen &&
            settingRef.current.open
        ) {
            settingRef.current.close();
        }
    }, [isSettingOpen]);

    function handleClick() {
        setIsSettingOpen(true);
    }

    function closeDialog() {
        setIsSettingOpen(false);
    }

    async function handleSignout() {
        try {
            await signOut(auth);
            setIsSettingOpen(false);
            navigate("/Login");
        } catch (error) {
            console.error(
                "Error signing out:",
                error
            );

            alert("Failed to sign out.");
        }
    }

    function handleAddCarDialog() {
        setIsAddCarOpen(true);
    }

    function handleAddCarDialogClose() {
        setIsAddCarOpen(false);
    }

    return (
        <>
            <div className="header">

                <div className="cont">

                    <img
                        src={logo}
                        alt="Company Logo"
                        className="logo"
                    />

                    <h2>
                        Car Rental
                    </h2>

                    <span className="user-email">
                        {user?.email}
                    </span>

                    {isAdmin && (
                        <button
                            type="button"
                            className="add-car"
                            onClick={
                                handleAddCarDialog
                            }
                        >
                            + Add New Car
                        </button>
                    )}

                    <button
                        type="button"
                        className="setting-btn"
                        onClick={handleClick}
                    >
                        <img
                            className="setting-icon"
                            src={settingsImage}
                            alt="Settings"
                        />
                    </button>

                </div>
            </div>

            <nav className="menu">

                <ul>

                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive
                                    ? "button active"
                                    : "button"
                            }
                        >
                            🚗 Cars
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/History"
                            className={({ isActive }) =>
                                isActive
                                    ? "button active"
                                    : "button"
                            }
                        >
                            📋 History
                        </NavLink>
                    </li>

                </ul>

            </nav>

            <dialog
                ref={settingRef}
                className="SettingDialog"
                onCancel={closeDialog}
            >

                <button
                    type="button"
                    className="close-dialog"
                    onClick={closeDialog}
                >
                    ×
                </button>

                <div className="setting-header">

                    <h2>
                        Settings
                    </h2>

                </div>

                <div className="setting-container">

                    <div className="setting-menu">

                        <button
                            type="button"
                            className="Account-btn"
                        >
                            Account
                        </button>

                    </div>

                    <div className="setting-content">

                        <div className="setting-labels">

                            <label>
                                First Name
                            </label>

                            <label>
                                Last Name
                            </label>

                            <label>
                                Email
                            </label>

                            <label>
                                License Number
                            </label>

                            <label>
                                Phone Number
                            </label>

                            <label>
                                Date Of Birth
                            </label>

                        </div>

                        <div className="setting-inputs">

                            <input
                                type="text"
                                value={
                                    userData?.firstName ||
                                    ""
                                }
                                readOnly
                            />

                            <input
                                type="text"
                                value={
                                    userData?.lastName ||
                                    ""
                                }
                                readOnly
                            />

                            <input
                                type="text"
                                value={
                                    userData?.email ||
                                    user?.email ||
                                    ""
                                }
                                readOnly
                            />

                            <input
                                type="text"
                                value={
                                    userData?.licenseNumber ||
                                    ""
                                }
                                readOnly
                            />

                            <input
                                type="text"
                                value={
                                    userData?.phoneNumber ||
                                    ""
                                }
                                readOnly
                            />

                            <input
                                type="date"
                                value={
                                    userData?.dateOfBirth ||
                                    ""
                                }
                                readOnly
                            />

                            <button
                                type="button"
                                className="singout-btn"
                                onClick={
                                    handleSignout
                                }
                            >
                                Signout
                            </button>

                        </div>

                    </div>

                </div>

            </dialog>

            {isAdmin && (
                <AddCarDialog
                    isOpen={isAddCarOpen}
                    onClose={
                        handleAddCarDialogClose
                    }
                    cars={cars}
                    setCars={setCars}
                    isAdd={true}
                    selectedCar={null}
                />
            )}
        </>
    );
}

export default Header;
