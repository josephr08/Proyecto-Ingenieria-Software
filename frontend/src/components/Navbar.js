import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const logout = () => { localStorage.removeItem("token"); localStorage.removeItem("role"); navigate("/login"); };

    return (
        <header className="header">
            <div className="container header-inner">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="brand">
                        <div className="logo">💧</div>
                        <div>Sangil Water</div>
                    </div>
                </div>

                <nav className="nav">
                    <Link to="/">Home</Link>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/payments">Payments</Link>
                    <Link to="/contact">Contact</Link>
                    {!token ? <Link to="/login">Login</Link> : <button onClick={logout} className="btn" style={{ padding: '8px 10px' }}>Logout</button>}
                </nav>
            </div>
        </header>
    );
}
