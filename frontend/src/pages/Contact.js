import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Contact() {
    const [formData, setFormData] = useState({ subject: "", message: "" });
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ subject: "", message: "" });
        }, 3000);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="page-wrapper">
            <nav className="dashboard-nav">
                <div className="container nav-content">
                    <div className="logo">💧 Sangil Water</div>
                    <div className="nav-menu">
                        <Link to="/dashboard" className="nav-item">Dashboard</Link>
                        <Link to="/receipts" className="nav-item">Receipts</Link>
                        <Link to="/payments" className="nav-item">Payments</Link>
                        <Link to="/contact" className="nav-item active">Support</Link>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </nav>

            <div className="page-content">
                <div className="container">
                    <div className="page-header">
                        <h1>Customer Support</h1>
                        <p>We're here to help with any questions or concerns</p>
                    </div>

                    <div className="contact-layout">
                        <div className="contact-info">
                            <div className="info-card">
                                <div className="info-icon">📧</div>
                                <h3>Email Us</h3>
                                <p>support@sangilwater.co</p>
                                <p className="info-detail">Response within 24 hours</p>
                            </div>

                            <div className="info-card">
                                <div className="info-icon">📞</div>
                                <h3>Call Us</h3>
                                <p>+57 (7) 724-XXXX</p>
                                <p className="info-detail">Mon-Fri, 8am-6pm</p>
                            </div>

                            <div className="info-card">
                                <div className="info-icon">💬</div>
                                <h3>Live Chat</h3>
                                <p>Available now</p>
                                <button className="chat-btn">Start Chat</button>
                            </div>

                            <div className="faq-section">
                                <h3>Quick Help</h3>
                                <div className="faq-list">
                                    <div className="faq-item">
                                        <strong>How do I pay my bill?</strong>
                                        <p>Go to Payments section and select your pending bill</p>
                                    </div>
                                    <div className="faq-item">
                                        <strong>Where can I see my consumption?</strong>
                                        <p>Check the Dashboard for weekly and monthly stats</p>
                                    </div>
                                    <div className="faq-item">
                                        <strong>How to download receipts?</strong>
                                        <p>Visit Receipts section and click Download PDF</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="contact-form-section">
                            {submitted ? (
                                <div className="success-message">
                                    <div className="success-icon">✓</div>
                                    <h3>Message Sent!</h3>
                                    <p>We've received your message and will respond soon</p>
                                </div>
                            ) : (
                                <>
                                    <h2>Send us a Message</h2>
                                    <p className="form-subtitle">Fill out the form below and we'll get back to you as soon as possible</p>

                                    <form onSubmit={handleSubmit} className="contact-form">
                                        <div className="form-group">
                                            <label>Subject</label>
                                            <select
                                                className="form-input"
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                required
                                            >
                                                <option value="">Select a subject</option>
                                                <option value="billing">Billing Question</option>
                                                <option value="technical">Technical Issue</option>
                                                <option value="consumption">Consumption Inquiry</option>
                                                <option value="service">Service Request</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>Message</label>
                                            <textarea
                                                className="form-textarea"
                                                rows="8"
                                                placeholder="Tell us how we can help..."
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                required
                                            ></textarea>
                                        </div>

                                        <button type="submit" className="submit-btn">
                                            Send Message
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .page-wrapper {
                    min-height: 100vh;
                    background: #f5f7fa;
                }

                .dashboard-nav {
                    background: white;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                    padding: 1rem 0;
                    position: sticky;
                    top: 0;
                    z-index: 100;
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

                .nav-menu {
                    display: flex;
                    gap: 0.5rem;
                }

                .nav-item {
                    padding: 0.5rem 1rem;
                    text-decoration: none;
                    color: #666;
                    border-radius: 8px;
                    transition: all 0.3s;
                }

                .nav-item:hover {
                    background: #f0f2f5;
                    color: #667eea;
                }

                .nav-item.active {
                    background: #667eea;
                    color: white;
                }

                .logout-btn {
                    background: transparent;
                    border: 2px solid #e5e7eb;
                    padding: 0.5rem 1.25rem;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s;
                }

                .logout-btn:hover {
                    background: #f9fafb;
                    border-color: #667eea;
                    color: #667eea;
                }

                .page-content {
                    padding: 2rem 0 4rem 0;
                }

                .page-header {
                    margin-bottom: 2rem;
                }

                .page-header h1 {
                    font-size: 2rem;
                    margin: 0 0 0.5rem 0;
                    color: #333;
                }

                .page-header p {
                    color: #666;
                    margin: 0;
                }

                .contact-layout {
                    display: grid;
                    grid-template-columns: 350px 1fr;
                    gap: 2rem;
                }

                .contact-info {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .info-card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    text-align: center;
                }

                .info-icon {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                }

                .info-card h3 {
                    margin: 0 0 0.5rem 0;
                    color: #333;
                }

                .info-card p {
                    margin: 0.25rem 0;
                    color: #667eea;
                    font-weight: 600;
                }

                .info-detail {
                    color: #999 !important;
                    font-weight: normal !important;
                    font-size: 0.9rem;
                }

                .chat-btn {
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 0.5rem 1.5rem;
                    border-radius: 8px;
                    margin-top: 0.75rem;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s;
                }

                .chat-btn:hover {
                    background: #5568d3;
                }

                .faq-section {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                }

                .faq-section h3 {
                    margin: 0 0 1rem 0;
                    color: #333;
                }

                .faq-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .faq-item {
                    padding: 1rem;
                    background: #f8f9ff;
                    border-radius: 8px;
                }

                .faq-item strong {
                    display: block;
                    color: #667eea;
                    margin-bottom: 0.5rem;
                }

                .faq-item p {
                    margin: 0;
                    color: #666;
                    font-size: 0.9rem;
                }

                .contact-form-section {
                    background: white;
                    padding: 2.5rem;
                    border-radius: 16px;
                }

                .contact-form-section h2 {
                    margin: 0 0 0.5rem 0;
                    color: #333;
                }

                .form-subtitle {
                    color: #666;
                    margin: 0 0 2rem 0;
                }

                .contact-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .form-group label {
                    font-weight: 600;
                    color: #333;
                }

                .form-input, .form-textarea {
                    padding: 0.875rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-family: inherit;
                    transition: all 0.3s;
                }

                .form-input:focus, .form-textarea:focus {
                    outline: none;
                    border-color: #667eea;
                }

                .form-textarea {
                    resize: vertical;
                    min-height: 150px;
                }

                .submit-btn {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 1rem;
                    border-radius: 12px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .submit-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(102,126,234,0.4);
                }

                .success-message {
                    text-align: center;
                    padding: 4rem 2rem;
                }

                .success-icon {
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3rem;
                    margin: 0 auto 1.5rem auto;
                }

                .success-message h3 {
                    margin: 0 0 0.75rem 0;
                    color: #333;
                }

                .success-message p {
                    margin: 0;
                    color: #666;
                }

                @media (max-width: 968px) {
                    .contact-layout {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}