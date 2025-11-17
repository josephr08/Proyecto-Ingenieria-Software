import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="home-wrapper">
            <nav className="navbar">
                <div className="container nav-content">
                    <div className="logo">💧 Sangil Water</div>
                    <div className="nav-links">
                        <Link to="/login" className="btn-outline">Login</Link>
                        <Link to="/register" className="btn-primary">Get Started</Link>
                    </div>
                </div>
            </nav>

            <section className="hero-section">
                <div className="container">
                    <div className="hero-grid">
                        <div className="hero-content">
                            <h1 className="hero-title">
                                Manage Your Water Service
                                <span className="gradient-text"> Effortlessly</span>
                            </h1>
                            <p className="hero-subtitle">
                                Track consumption, pay bills online, and get instant support.
                                Everything you need in one modern portal.
                            </p>
                            <div className="hero-buttons">
                                <Link to="/register" className="btn-primary btn-large">
                                    Create Account
                                </Link>
                                <Link to="/login" className="btn-outline btn-large">
                                    Sign In
                                </Link>
                            </div>

                            <div className="demo-accounts">
                                <p className="small-text">Demo Accounts:</p>
                                <div className="demo-grid">
                                    <div className="demo-badge">

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="hero-visual">
                            <div className="feature-card floating">
                                <div className="feature-icon">📊</div>
                                <h4>Real-time Stats</h4>
                                <p>Monitor your consumption weekly and monthly</p>
                            </div>
                            <div className="feature-card floating" style={{ animationDelay: '0.2s' }}>
                                <div className="feature-icon">💳</div>
                                <h4>Easy Payments</h4>
                                <p>Pay your bills securely online</p>
                            </div>
                            <div className="feature-card floating" style={{ animationDelay: '0.4s' }}>
                                <div className="feature-icon">🎯</div>
                                <h4>Quick Support</h4>
                                <p>Get help when you need it</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Everything You Need</h2>
                    <div className="features-grid">
                        <div className="feature-box">
                            <div className="feature-icon-large">📈</div>
                            <h3>Track Usage</h3>
                            <p>View detailed consumption statistics for the week and month</p>
                        </div>
                        <div className="feature-box">
                            <div className="feature-icon-large">🧾</div>
                            <h3>View Receipts</h3>
                            <p>Access all your billing history in one place</p>
                        </div>
                        <div className="feature-box">
                            <div className="feature-icon-large">💰</div>
                            <h3>Online Payment</h3>
                            <p>Pay your bills quickly and securely</p>
                        </div>
                        <div className="feature-box">
                            <div className="feature-icon-large">👨‍💼</div>
                            <h3>Admin Tools</h3>
                            <p>Comprehensive management dashboard for staff</p>
                        </div>
                    </div>
                </div>
            </section>

            <style jsx>{`
                .home-wrapper {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }

                .navbar {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    padding: 1rem 0;
                    box-shadow: 0 2px 20px rgba(0,0,0,0.1);
                }

                .nav-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .logo {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #667eea;
                }

                .nav-links {
                    display: flex;
                    gap: 1rem;
                }

                .hero-section {
                    padding: 5rem 0;
                    color: white;
                }

                .hero-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 3rem;
                    align-items: center;
                }

                .hero-title {
                    font-size: 3.5rem;
                    font-weight: 800;
                    line-height: 1.2;
                    margin-bottom: 1.5rem;
                }

                .gradient-text {
                    background: linear-gradient(90deg, #fff, #a8edea);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .hero-subtitle {
                    font-size: 1.25rem;
                    opacity: 0.9;
                    margin-bottom: 2rem;
                    line-height: 1.6;
                }

                .hero-buttons {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 3rem;
                }

                .btn-large {
                    padding: 1rem 2rem;
                    font-size: 1.1rem;
                }

                .btn-primary {
                    background: white;
                    color: #667eea;
                    padding: 0.75rem 1.5rem;
                    border-radius: 12px;
                    text-decoration: none;
                    font-weight: 600;
                    transition: all 0.3s;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
                }

                .btn-outline {
                    background: transparent;
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 12px;
                    text-decoration: none;
                    font-weight: 600;
                    border: 2px solid white;
                    transition: all 0.3s;
                }

                .btn-outline:hover {
                    background: white;
                    color: #667eea;
                }

                .demo-accounts {
                    background: rgba(255,255,255,0.15);
                    backdrop-filter: blur(10px);
                    padding: 1.5rem;
                    border-radius: 12px;
                    border: 1px solid rgba(255,255,255,0.2);
                }

                .small-text {
                    font-size: 0.9rem;
                    opacity: 0.8;
                    margin-bottom: 0.75rem;
                }

                .demo-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .demo-badge {
                    display: flex;
                    gap: 0.75rem;
                    align-items: center;
                    font-size: 0.85rem;
                }

                .badge-label {
                    background: rgba(255,255,255,0.3);
                    padding: 0.25rem 0.75rem;
                    border-radius: 6px;
                    font-weight: 600;
                }

                .badge-value {
                    font-family: monospace;
                }

                .hero-visual {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .feature-card {
                    background: white;
                    padding: 2rem;
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                    color: #333;
                }

                .feature-card.floating {
                    animation: float 3s ease-in-out infinite;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                .feature-icon {
                    font-size: 2.5rem;
                    margin-bottom: 0.5rem;
                }

                .feature-card h4 {
                    margin: 0 0 0.5rem 0;
                    color: #667eea;
                }

                .feature-card p {
                    margin: 0;
                    color: #666;
                    font-size: 0.95rem;
                }

                .features-section {
                    background: white;
                    padding: 5rem 0;
                }

                .section-title {
                    text-align: center;
                    font-size: 2.5rem;
                    margin-bottom: 3rem;
                    color: #333;
                }

                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 2rem;
                }

                .feature-box {
                    text-align: center;
                    padding: 2rem;
                    border-radius: 16px;
                    background: #f8f9ff;
                    transition: all 0.3s;
                }

                .feature-box:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(102,126,234,0.2);
                }

                .feature-icon-large {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }

                .feature-box h3 {
                    color: #667eea;
                    margin-bottom: 0.75rem;
                }

                .feature-box p {
                    color: #666;
                    font-size: 0.95rem;
                }

                @media (max-width: 968px) {
                    .hero-grid {
                        grid-template-columns: 1fr;
                    }
                    .features-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 640px) {
                    .hero-title {
                        font-size: 2.5rem;
                    }
                    .features-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}