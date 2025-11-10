import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
    const role = localStorage.getItem("role");

    const baseLink =
        "block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all font-medium";
    const activeLink =
        "bg-blue-100 text-blue-700 font-semibold border-l-4 border-blue-500";

    return (
        <aside className="w-56 h-screen bg-white border-r shadow-sm p-4 flex flex-col">
            {/* Logo / Header */}
            <div className="text-xl font-bold text-gray-800 mb-6">📋 Menu</div>

            {/* Links comunes */}
            <nav className="flex flex-col gap-2">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `${baseLink} ${isActive ? activeLink : ""}`
                    }
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/payments"
                    className={({ isActive }) =>
                        `${baseLink} ${isActive ? activeLink : ""}`
                    }
                >
                    Payments
                </NavLink>

                <NavLink
                    to="/contact"
                    className={({ isActive }) =>
                        `${baseLink} ${isActive ? activeLink : ""}`
                    }
                >
                    Contact
                </NavLink>

                {/* Sección exclusiva del admin */}
                {role === "admin" && (
                    <>
                        <div className="mt-4 mb-1 text-sm text-gray-500 font-semibold uppercase">
                            Admin
                        </div>
                        <NavLink
                            to="/admin/stats"
                            className={({ isActive }) =>
                                `${baseLink} ${isActive ? activeLink : ""}`
                            }
                        >
                            Manage Stats
                        </NavLink>
                        <NavLink
                            to="/admin/receipts"
                            className={({ isActive }) =>
                                `${baseLink} ${isActive ? activeLink : ""}`
                            }
                        >
                            Receipts
                        </NavLink>
                    </>
                )}
            </nav>

            {/* Footer pequeño */}
            <div className="mt-auto pt-4 text-xs text-gray-400 border-t">
                Sangil Water © {new Date().getFullYear()}
            </div>
        </aside>
    );
}
