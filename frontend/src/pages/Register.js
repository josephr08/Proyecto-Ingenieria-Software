import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: ''
    });
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg('');
        setLoading(true);

        try {
            const base = process.env.REACT_APP_API_URL || 'http://localhost:5050/api';
            await axios.post(`${base}/auth/register`, formData);
            setMsg('✓ Account created successfully! Redirecting...');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            console.error(err);
            setMsg('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <Link to="/" className="back-link">← Back to Home</Link>
                        <h2>Create Account</h2>
                        <p className="auth-subtitle">Join Sangil Water customer portal</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-input"
                                placeholder="Juan Pérez"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                placeholder="juan@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="form-input"
                                    placeholder="+57 300 123 4567"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-input"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Address</label>
                            <input
                                type="text"
                                name="address"
                                className="form-input"
                                placeholder="Calle 123 #45-67"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {msg && (
                            <div className={`message ${msg.includes('✓') ? 'success' : 'error'}`}>
                                {msg}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>

                        <div className="auth-footer">
                            Already have an account? <Link to="/login">Sign in</Link>
                        </div>
                    </form>
                </div>

                <div className="auth-visual">
                    <div className="visual-content">
                        <h3>Start managing your water service today</h3>
                        <ul className="feature-list">
                            <li>✓ Track your consumption in real-time</li>
                            <li>✓ Pay bills online securely</li>
                            <li>✓ Access 24/7 support</li>
                            <li>✓ View complete billing history</li>
                        </ul>
                    </div>
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

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
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

                .message.success {
                    background: #d1fae5;
                    color: #065f46;
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
                    margin-bottom: 2rem;
                    line-height: 1.3;
                }

                .feature-list {
                    list-style: none;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }

                .feature-list li {
                    font-size: 1.1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    opacity: 0.95;
                }

                @media (max-width: 968px) {
                    .auth-container {
                        grid-template-columns: 1fr;
                    }
                    .auth-visual {
                        display: none;
                    }
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}