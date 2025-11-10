import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <header className="bg-white border-b shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="text-2xl">💧</div>
                    <h1 className="font-semibold text-lg text-gray-800 tracking-tight">
                        Sangil Water
                    </h1>
                </div>

                {/* Navegación */}
                <nav className="flex items-center gap-6 text-gray-600 font-medium">
                    {/* Links comunes */}
                    <Link to="/" className="hover:text-blue-600 transition-colors">
                        Home
                    </Link>

                    <Link to="/stats" className="hover:text-blue-600 transition-colors">
                        Stats
                    </Link>

                    <Link to="/payments" className="hover:text-blue-600 transition-colors">
                        Payments
                    </Link>

                    {/* Links exclusivos de Admin */}
                    {role === "admin" && (
                        <>
                            <Link
                                to="/admin/stats"
                                className="hover:text-blue-600 transition-colors"
                            >
                                Manage Stats
                            </Link>
                            <Link
                                to="/admin/receipts"
                                className="hover:text-blue-600 transition-colors"
                            >
                                Receipts
                            </Link>
                        </>
                    )}

                    {/* Autenticación */}
                    {!token ? (
                        <Link
                            to="/login"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                        >
                            Login
                        </Link>
                    ) : (
                        <button
                            onClick={logout}
                            className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all"
                        >
                            Logout
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
}