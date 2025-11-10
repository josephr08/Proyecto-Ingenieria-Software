import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute
 * - Protege rutas que requieren autenticación.
 * - Permite restringir acceso por rol.
 *
 * @param {ReactNode} children - Contenido protegido.
 * @param {Array<string>} allowedRoles - Lista de roles permitidos (opcional).
 */
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // 🔒 Si no hay token, enviar al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Si hay restricción de rol y el rol actual no está permitido
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Si es admin el que intenta entrar a zona de cliente
    return role === "admin" ? (
      <Navigate to="/admin/stats" replace />
    ) : (
      <Navigate to="/dashboard" replace />
    );
  }

  // ✅ Si pasa los filtros, renderiza el contenido
  return children;
}