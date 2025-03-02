import { React, useState } from "react";
import { assets } from "../../assets/assets";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [user, setUser] = useState(null); // Stores logged-in user info
    const [isRegistering, setIsRegistering] = useState(true); // Toggle between Sign Up & Log In

    const handleAuth = () => {
        if (!user) {
            if (isRegistering) {
                // Simulate user sign-up
                setUser({ name: "User" }); // Replace this with actual auth logic
                setIsRegistering(false);
            } else {
                // Simulate user login
                setUser({ name: "User" });
            }
        } else {
            // Logout
            setUser(null);
            setIsRegistering(true);
        }
    };

    return (
        <div className="navbar">
            <img src={assets.logo} alt="CollabCode" className="logo" />
            <ul className="navbar-menu">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/session">Session</Link></li>
                {user && <li><Link to="/account">My Profile</Link></li>}
            </ul>
            <div className="navbar-right">
                <button onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                </button>
                <button onClick={handleAuth}>
                    {user ? "Logout" : isRegistering ? "Sign Up" : "Log In"}
                </button>
            </div>
        </div>
    );
};

export default Navbar;
