import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Receipts() {
    const [receipts, setReceipts] = useState([]);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        // Demo data
        setReceipts([
            { id: 1, month: "October 2025", consumption: 185, rate: 2850, total: 527250, status: "paid", dueDate: "2025-10-15", paidDate: "2025-10-12" },
            { id: 2, month: "November 2025", consumption: 192, rate: 2850, total: 547200, status: "pending", dueDate: "2025-11-15", paidDate: null },
            { id: 3, month: "September 2025", consumption: 178, rate: 2800, total: 498400, status: "paid", dueDate: "2025-09-15", paidDate: "2025-09-14" },
        ]);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    //download receipt as PDF (dummy function)


    async function downloadReceiptPDF(receiptId) {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/receipts/${receiptId}/pdf`,
                {
                    responseType: "blob", // VERY IMPORTANT for PDF
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Create a Blob from the PDF stream
            const pdfBlob = new Blob([response.data], { type: "application/pdf" });

            // Create a link to trigger download
            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `receipt-${receiptId}.pdf`;

            document.body.appendChild(link);
            link.click();

            // Cleanup
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Error downloading PDF:", error);
            alert("❌ Could not download receipt PDF. Check console for details.");
        }
    }


    return (
        <div className="page-wrapper">
            <nav className="dashboard-nav">
                <div className="container nav-content">
                    <div className="logo">💧 Sangil Water</div>
                    <div className="nav-menu">
                        <Link to="/dashboard" className="nav-item">Dashboard</Link>
                        <Link to="/receipts" className="nav-item active">Receipts</Link>
                        <Link to="/payments" className="nav-item">Payments</Link>
                        <Link to="/contact" className="nav-item">Support</Link>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </nav>

            <div className="page-content">
                <div className="container">
                    <div className="page-header">
                        <h1>Billing History</h1>
                        <p>View and download your receipts</p>
                    </div>

                    <div className="receipts-layout">
                        <div className="receipts-list">
                            {receipts.map(receipt => (
                                <div
                                    key={receipt.id}
                                    className={`receipt-item ${selectedReceipt?.id === receipt.id ? 'active' : ''}`}
                                    onClick={() => setSelectedReceipt(receipt)}
                                >
                                    <div className="receipt-header">
                                        <div className="receipt-month">{receipt.month}</div>
                                        <div className={`status-badge ${receipt.status}`}>
                                            {receipt.status === 'paid' ? '✓ Paid' : '⏳ Pending'}
                                        </div>
                                    </div>
                                    <div className="receipt-info">
                                        <div className="info-item">
                                            <span className="label">Consumption:</span>
                                            <span className="value">{receipt.consumption} m³</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="label">Total:</span>
                                            <span className="value bold">${receipt.total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="receipt-date">
                                        Due: {receipt.dueDate}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="receipt-details">
                            {selectedReceipt ? (
                                <div className="detail-card">
                                    <div className="detail-header">
                                        <h2>Receipt Details</h2>
                                        <button className="download-btn" onClick={() => downloadReceiptPDF(receipts.id)}>📥 Download PDF</button>
                                    </div>


                                    <div className="company-info">
                                        <h3>Sangil Water Services</h3>
                                        <p>Sangil, Santander, Colombia</p>
                                        <p>NIT: 900.123.456-7</p>
                                    </div>

                                    <div className="detail-section">
                                        <h4>Billing Period</h4>
                                        <p>{selectedReceipt.month}</p>
                                    </div>

                                    <div className="detail-section">
                                        <h4>Consumption Details</h4>
                                        <div className="detail-row">
                                            <span>Total Consumption</span>
                                            <span>{selectedReceipt.consumption} m³</span>
                                        </div>
                                        <div className="detail-row">
                                            <span>Rate per m³</span>
                                            <span>${selectedReceipt.rate.toLocaleString()}</span>
                                        </div>
                                        <div className="detail-row subtotal">
                                            <span>Subtotal</span>
                                            <span>${(selectedReceipt.consumption * selectedReceipt.rate).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h4>Additional Charges</h4>
                                        <div className="detail-row">
                                            <span>Service Fee</span>
                                            <span>$0</span>
                                        </div>
                                        <div className="detail-row">
                                            <span>Tax (0%)</span>
                                            <span>$0</span>
                                        </div>
                                    </div>

                                    <div className="total-section">
                                        <div className="total-row">
                                            <span>Total Amount</span>
                                            <span>${selectedReceipt.total.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h4>Payment Information</h4>
                                        <div className="detail-row">
                                            <span>Status</span>
                                            <span className={`status-text ${selectedReceipt.status}`}>
                                                {selectedReceipt.status === 'paid' ? 'Paid ✓' : 'Pending Payment'}
                                            </span>
                                        </div>
                                        <div className="detail-row">
                                            <span>Due Date</span>
                                            <span>{selectedReceipt.dueDate}</span>
                                        </div>
                                        {selectedReceipt.paidDate && (
                                            <div className="detail-row">
                                                <span>Paid On</span>
                                                <span>{selectedReceipt.paidDate}</span>
                                            </div>
                                        )}
                                    </div>

                                    {selectedReceipt.status === 'pending' && (
                                        <Link to="/payments" className="pay-button">
                                            Pay Now
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-icon">🧾</div>
                                    <h3>Select a receipt</h3>
                                    <p>Choose a receipt from the list to view details</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div >



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

                .receipts-layout {
                    display: grid;
                    grid-template-columns: 400px 1fr;
                    gap: 2rem;
                    min-height: 600px;
                }

                .receipts-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .receipt-item {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 16px;
                    cursor: pointer;
                    transition: all 0.3s;
                    border: 2px solid transparent;
                }

                .receipt-item:hover {
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                    transform: translateY(-2px);
                }

                .receipt-item.active {
                    border-color: #667eea;
                    box-shadow: 0 4px 20px rgba(102,126,234,0.2);
                }

                .receipt-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .receipt-month {
                    font-weight: 700;
                    font-size: 1.1rem;
                    color: #333;
                }

                .status-badge {
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 600;
                }

                .status-badge.paid {
                    background: #d1fae5;
                    color: #065f46;
                }

                .status-badge.pending {
                    background: #fef3c7;
                    color: #92400e;
                }

                .receipt-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    margin-bottom: 0.75rem;
                }

                .info-item {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.95rem;
                }

                .label {
                    color: #666;
                }

                .value {
                    color: #333;
                }

                .value.bold {
                    font-weight: 700;
                    color: #667eea;
                }

                .receipt-date {
                    font-size: 0.85rem;
                    color: #999;
                    padding-top: 0.75rem;
                    border-top: 1px solid #f0f0f0;
                }

                .receipt-details {
                    background: white;
                    border-radius: 16px;
                    padding: 2rem;
                }

                .detail-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    padding-bottom: 1rem;
                    border-bottom: 2px solid #f0f0f0;
                }

                .detail-header h2 {
                    margin: 0;
                    color: #333;
                }

                .download-btn {
                    background: #f0f2f5;
                    border: none;
                    padding: 0.75rem 1.25rem;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s;
                }

                .download-btn:hover {
                    background: #e5e7eb;
                }

                .company-info {
                    background: #f8f9ff;
                    padding: 1.5rem;
                    border-radius: 12px;
                    margin-bottom: 2rem;
                }

                .company-info h3 {
                    margin: 0 0 0.5rem 0;
                    color: #667eea;
                }

                .company-info p {
                    margin: 0.25rem 0;
                    color: #666;
                    font-size: 0.95rem;
                }

                .detail-section {
                    margin-bottom: 2rem;
                }

                .detail-section h4 {
                    margin: 0 0 1rem 0;
                    color: #333;
                    font-size: 1.1rem;
                }

                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.75rem 0;
                    border-bottom: 1px solid #f0f0f0;
                }

                .detail-row.subtotal {
                    font-weight: 600;
                    color: #333;
                }

                .total-section {
                    background: #667eea;
                    color: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    margin-bottom: 2rem;
                }

                .total-row {
                    display: flex;
                    justify-content: space-between;
                    font-size: 1.5rem;
                    font-weight: 700;
                }

                .status-text.paid {
                    color: #059669;
                    font-weight: 600;
                }

                .status-text.pending {
                    color: #d97706;
                    font-weight: 600;
                }

                .pay-button {
                    display: block;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    text-align: center;
                    padding: 1rem;
                    border-radius: 12px;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 1.1rem;
                    transition: all 0.3s;
                }

                .pay-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(102,126,234,0.4);
                }

                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    color: #999;
                }

                .empty-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                    opacity: 0.5;
                }

                .empty-state h3 {
                    margin: 0 0 0.5rem 0;
                    color: #666;
                }

                .empty-state p {
                    margin: 0;
                }

                @media (max-width: 968px) {
                    .receipts-layout {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div >
    );
}