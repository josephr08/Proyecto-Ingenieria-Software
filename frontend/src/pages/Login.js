import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setErr("");
        setLoading(true);

        try {
            const base = process.env.REACT_APP_API_URL || "http://localhost:5050/api";
            const res = await axios.post(`${base}/auth/login`, { email, password }, { timeout: 5000 });

            if (res.data?.token) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("role", res.data.user?.role || "customer");
                localStorage.setItem("userName", res.data.user?.name || "User");

                const role = res.data.user?.role || "customer";
                navigate(role === "admin" ? "/admin/dashboard" : "/dashboard");
            } else {
                setErr("Login failed");
            }
        } catch (e) {
            console.error(e);
            setErr("Invalid credentials or connection error. Please check your email and password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-visual">
                    <div className="visual-content">
                        <h3>Welcome back to Sangil Water</h3>
                        <p className="visual-text">
                            Access your account to manage your water service,
                            view consumption stats, and pay bills online.
                        </p>
                        <div className="demo-section">
                            <p className="demo-title">Demo Accounts</p>
                            <div className="demo-card">
                                <span className="demo-label">Customer</span>
                                <span className="demo-value">juanchito@gmail.com</span>
                                <span className="demo-pass">juanchito123</span>
                            </div>
                            <div className="demo-card">
                                <span className="demo-label">Admin</span>
                                <span className="demo-value">joseph@admin.com</span>
                                <span className="demo-pass">joseph456</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="auth-card">
                    <div className="auth-header">
                        <Link to="/" className="back-link">← Back to Home</Link>
                        <h2>Sign In</h2>
                        <p className="auth-subtitle">Enter your credentials to continue</p>
                    </div>

                    <form onSubmit={submit} className="auth-form">
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="your@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {err && (
                            <div className="message error">
                                {err}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>

                        <div className="auth-footer">
                            Don't have an account? <Link to="/register">Create one</Link>
                        </div>
                    </form>
                </div>
            </div>

            <style jsx>{`
                .auth-page {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                }

                .auth-container {
                    max-width: 1100px;
                    width: 100%;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                    align-items: center;
                }

                .auth-card {
                    background: white;
                    padding: 3rem;
                    border-radius: 24px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                }

                .auth-header {
                    margin-bottom: 2rem;
                }

                .back-link {
                    color: #667eea;
                    text-decoration: none;
                    font-size: 0.9rem;
                    display: inline-block;
                    margin-bottom: 1rem;
                }

                .back-link:hover {
                    text-decoration: underline;
                }

                .auth-header h2 {
                    margin: 0 0 0.5rem 0;
                    font-size: 2rem;
                    color: #333;
                }

                .auth-subtitle {
                    color: #666;
                    margin: 0;
                }

                .auth-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .form-group label {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #333;
                }

                .form-input {
                    padding: 0.875rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 12px;
                    font-size: 1rem;
                    transition: all 0.3s;
                }

                .form-input:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
                }

                .message {
                    padding: 0.875rem;
                    border-radius: 12px;
                    font-size: 0.9rem;
                    text-align: center;
                }

                .message.error {
                    background: #fee2e2;
                    color: #991b1b;
                }

                .btn-submit {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 1rem;
                    border: none;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .btn-submit:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(102,126,234,0.4);
                }

                .btn-submit:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .auth-footer {
                    text-align: center;
                    color: #666;
                    font-size: 0.9rem;
                }

                .auth-footer a {
                    color: #667eea;
                    text-decoration: none;
                    font-weight: 600;
                }

                .auth-footer a:hover {
                    text-decoration: underline;
                }

                .auth-visual {
                    color: white;
                    padding: 2rem;
                }

                .visual-content h3 {
                    font-size: 2rem;
                    margin-bottom: 1rem;
                    line-height: 1.3;
                }

                .visual-text {
                    font-size: 1.1rem;
                    opacity: 0.9;
                    margin-bottom: 2rem;
                    line-height: 1.6;
                }

                .demo-section {
                    background: rgba(255,255,255,0.15);
                    backdrop-filter: blur(10px);
                    padding: 1.5rem;
                    border-radius: 16px;
                    border: 1px solid rgba(255,255,255,0.2);
                }

                .demo-title {
                    font-size: 0.9rem;
                    opacity: 0.8;
                    margin-bottom: 1rem;
                }

                .demo-card {
                    background: rgba(255,255,255,0.1);
                    padding: 1rem;
                    border-radius: 12px;
                    margin-bottom: 0.75rem;
                    display: grid;
                    grid-template-columns: auto 1fr;
                    gap: 0.5rem 1rem;
                    align-items: center;
                }

                .demo-label {
                    background: rgba(255,255,255,0.3);
                    padding: 0.25rem 0.75rem;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 0.85rem;
                    grid-column: 1;
                }

                .demo-value {
                    font-family: monospace;
                    font-size: 0.9rem;
                    grid-column: 2;
                }

                .demo-pass {
                    font-family: monospace;
                    font-size: 0.85rem;
                    opacity: 0.8;
                    grid-column: 1 / -1;
                    padding-left: 0.5rem;
                }

                @media (max-width: 968px) {
                    .auth-container {
                        grid-template-columns: 1fr;
                    }
                    .auth-visual {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
}