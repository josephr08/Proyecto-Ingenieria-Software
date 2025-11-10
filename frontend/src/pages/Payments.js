import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Payments() {
    const [pendingBills, setPendingBills] = useState([]);
    const [selectedBill, setSelectedBill] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        setPendingBills([
            { id: 2, month: "November 2024", amount: 547200, dueDate: "2024-11-15" }
        ]);
    }, [navigate]);

    const handlePayment = () => {
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setSuccess(true);
            setTimeout(() => {
                navigate("/receipts");
            }, 2000);
        }, 2000);
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
                        <Link to="/payments" className="nav-item active">Payments</Link>
                        <Link to="/contact" className="nav-item">Support</Link>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </nav>

            <div className="page-content">
                <div className="container">
                    <div className="page-header">
                        <h1>Make a Payment</h1>
                        <p>Pay your water bill quickly and securely</p>
                    </div>

                    {success ? (
                        <div className="success-card">
                            <div className="success-icon">✓</div>
                            <h2>Payment Successful!</h2>
                            <p>Your payment has been processed successfully</p>
                            <p className="redirect-text">Redirecting to receipts...</p>
                        </div>
                    ) : (
                        <div className="payment-layout">
                            <div className="bills-section">
                                <h3>Pending Bills</h3>
                                {pendingBills.length > 0 ? (
                                    <div className="bills-list">
                                        {pendingBills.map(bill => (
                                            <div
                                                key={bill.id}
                                                className={`bill-card ${selectedBill?.id === bill.id ? 'selected' : ''}`}
                                                onClick={() => setSelectedBill(bill)}
                                            >
                                                <div className="bill-header">
                                                    <span className="bill-month">{bill.month}</span>
                                                    <span className="bill-amount">${bill.amount.toLocaleString()}</span>
                                                </div>
                                                <div className="bill-due">Due: {bill.dueDate}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="no-bills">
                                        <p>✓ No pending bills</p>
                                    </div>
                                )}
                            </div>

                            <div className="payment-section">
                                {selectedBill ? (
                                    <>
                                        <div className="payment-summary">
                                            <h3>Payment Summary</h3>
                                            <div className="summary-row">
                                                <span>Billing Period</span>
                                                <span>{selectedBill.month}</span>
                                            </div>
                                            <div className="summary-row">
                                                <span>Due Date</span>
                                                <span>{selectedBill.dueDate}</span>
                                            </div>
                                            <div className="summary-total">
                                                <span>Total Amount</span>
                                                <span>${selectedBill.amount.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <div className="payment-method">
                                            <h3>Payment Method</h3>
                                            <div className="method-options">
                                                <label className={`method-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                                                    <input
                                                        type="radio"
                                                        name="payment"
                                                        value="card"
                                                        checked={paymentMethod === 'card'}
                                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                                    />
                                                    <div className="method-content">
                                                        <div className="method-icon">💳</div>
                                                        <div>
                                                            <div className="method-name">Credit/Debit Card</div>
                                                            <div className="method-desc">Visa, Mastercard, Amex</div>
                                                        </div>
                                                    </div>
                                                </label>

                                                <label className={`method-option ${paymentMethod === 'bank' ? 'selected' : ''}`}>
                                                    <input
                                                        type="radio"
                                                        name="payment"
                                                        value="bank"
                                                        checked={paymentMethod === 'bank'}
                                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                                    />
                                                    <div className="method-content">
                                                        <div className="method-icon">🏦</div>
                                                        <div>
                                                            <div className="method-name">Bank Transfer</div>
                                                            <div className="method-desc">PSE, Bank account</div>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>

                                        {paymentMethod === 'card' && (
                                            <div className="payment-form">
                                                <div className="form-group">
                                                    <label>Card Number</label>
                                                    <input type="text" className="form-input" placeholder="1234 5678 9012 3456" />
                                                </div>
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label>Expiry Date</label>
                                                        <input type="text" className="form-input" placeholder="MM/YY" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>CVV</label>
                                                        <input type="text" className="form-input" placeholder="123" />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label>Cardholder Name</label>
                                                    <input type="text" className="form-input" placeholder="John Doe" />
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            className="pay-btn"
                                            onClick={handlePayment}
                                            disabled={processing}
                                        >
                                            {processing ? '⏳ Processing...' : `Pay $${selectedBill.amount.toLocaleString()}`}
                                        </button>

                                        <div className="security-note">
                                            <span>🔒</span> Your payment information is secure and encrypted
                                        </div>
                                    </>
                                ) : (
                                    <div className="empty-payment">
                                        <div className="empty-icon">💳</div>
                                        <h3>Select a bill to pay</h3>
                                        <p>Choose a pending bill from the list to proceed with payment</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
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

                .success-card {
                    background: white;
                    padding: 4rem 2rem;
                    border-radius: 24px;
                    text-align: center;
                    max-width: 500px;
                    margin: 0 auto;
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
                    margin: 0 auto 2rem auto;
                }

                .success-card h2 {
                    margin: 0 0 1rem 0;
                    color: #333;
                }

                .success-card p {
                    color: #666;
                    margin: 0.5rem 0;
                }

                .redirect-text {
                    color: #999;
                    font-size: 0.9rem;
                }

                .payment-layout {
                    display: grid;
                    grid-template-columns: 350px 1fr;
                    gap: 2rem;
                }

                .bills-section h3, .payment-section h3 {
                    margin: 0 0 1.5rem 0;
                    color: #333;
                }

                .bills-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .bill-card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s;
                    border: 2px solid transparent;
                }

                .bill-card:hover {
                    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                }

                .bill-card.selected {
                    border-color: #667eea;
                    box-shadow: 0 4px 15px rgba(102,126,234,0.2);
                }

                .bill-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.75rem;
                }

                .bill-month {
                    font-weight: 700;
                    color: #333;
                }

                .bill-amount {
                    font-weight: 700;
                    color: #667eea;
                    font-size: 1.1rem;
                }

                .bill-due {
                    font-size: 0.9rem;
                    color: #666;
                }

                .no-bills {
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    text-align: center;
                    color: #10b981;
                }

                .payment-section {
                    background: white;
                    padding: 2rem;
                    border-radius: 16px;
                }

                .payment-summary {
                    background: #f8f9ff;
                    padding: 1.5rem;
                    border-radius: 12px;
                    margin-bottom: 2rem;
                }

                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.75rem 0;
                    border-bottom: 1px solid #e5e7eb;
                }

                .summary-total {
                    display: flex;
                    justify-content: space-between;
                    padding: 1rem 0 0 0;
                    font-weight: 700;
                    font-size: 1.25rem;
                    color: #667eea;
                }

                .payment-method {
                    margin-bottom: 2rem;
                }

                .method-options {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .method-option {
                    border: 2px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 1.25rem;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: block;
                }

                .method-option:hover {
                    border-color: #667eea;
                }

                .method-option.selected {
                    border-color: #667eea;
                    background: #f8f9ff;
                }

                .method-option input {
                    display: none;
                }

                .method-content {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }

                .method-icon {
                    font-size: 2rem;
                }

                .method-name {
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 0.25rem;
                }

                .method-desc {
                    font-size: 0.85rem;
                    color: #666;
                }

                .payment-form {
                    margin-bottom: 2rem;
                }

                .form-group {
                    margin-bottom: 1rem;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                    color: #333;
                    font-size: 0.9rem;
                }

                .form-input {
                    width: 100%;
                    padding: 0.875rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: all 0.3s;
                }

                .form-input:focus {
                    outline: none;
                    border-color: #667eea;
                }

                .pay-btn {
                    width: 100%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 1.25rem;
                    border-radius: 12px;
                    font-size: 1.1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s;
                    margin-bottom: 1rem;
                }

                .pay-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(102,126,234,0.4);
                }

                .pay-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .security-note {
                    text-align: center;
                    color: #666;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }

                .empty-payment {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem 2rem;
                    color: #999;
                }

                .empty-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                    opacity: 0.5;
                }

                .empty-payment h3 {
                    margin: 0 0 0.5rem 0;
                    color: #666;
                }

                .empty-payment p {
                    margin: 0;
                }

                @media (max-width: 968px) {
                    .payment-layout {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}