import axios from "axios";

// Detect API base URL dynamically (Docker-safe + local dev)
const API_URL =
    process.env.REACT_APP_API_URL ||
    window._env_?.REACT_APP_API_URL ||
    "http://localhost:5050"; // fallback for local dev

console.log("✅ Using API base URL:", API_URL);

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
