import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("stats");
    const [customers, setCustomers] = useState([]);
    const [statsForm, setStatsForm] = useState({ customerId: "", weekUsage: "", monthUsage: "" });
    const [receiptForm, setReceiptForm] = useState({ customerId: "", consumption: "", rate: 2850, billingMonth: "", dueDate: "" });
    const [supportTickets, setSupportTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [response, setResponse] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5050/api";

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token || role !== "admin") {
            navigate("/login");
            return;
        }

        loadCustomers();
        loadSupportTickets();
    }, [navigate]);

    const loadCustomers = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API_BASE}/admin/customers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCustomers(res.data);
        } catch (err) {
            console.error("Error loading customers:", err);
            // Fallback demo data
            setCustomers([
                { id: 1, name: "Juan Pérez", email: "juanchito@gmail.com", phone: "+57 300 123 4567", address: "Calle 10 #20-30" },
                { id: 2, name: "Rodolfo García", email: "rodolfito@gmail.com", phone: "+57 310 987 6543", address: "Carrera 5 #15-25" }
            ]);
        }
    };

    const loadSupportTickets = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API_BASE}/admin/support/tickets`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSupportTickets(res.data.map(t => ({
                ...t,
                date: new Date(t.created_at).toISOString().split('T')[0]
            })));
        } catch (err) {
            console.error("Error loading tickets:", err);
            // Fallback demo data
            setSupportTickets([
                { id: 1, customer_name: "Juan Pérez", subject: "Billing Question", message: "Why is my bill higher this month?", status: "open", date: "2025-11-05" }
            ]);
        }
    };

    const handleStatsSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const token = localStorage.getItem("token");
            await axios.post(`${API_BASE}/admin/stats/update`, {
                customerId: parseInt(statsForm.customerId),
                weekUsage: parseFloat(statsForm.weekUsage),
                monthUsage: parseFloat(statsForm.monthUsage)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage("✓ Statistics updated successfully!");
            setStatsForm({ customerId: "", weekUsage: "", monthUsage: "" });
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            console.error("Error updating stats:", err);
            setMessage("✗ Error updating statistics. Please try again.");
        }
    };

    const handleReceiptGenerate = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const token = localStorage.getItem("token");
            const total = parseFloat(receiptForm.consumption) * parseFloat(receiptForm.rate);

            await axios.post(`${API_BASE}/admin/receipts/generate`, {
                customerId: parseInt(receiptForm.customerId),
                consumption: parseFloat(receiptForm.consumption),
                rate: parseFloat(receiptForm.rate),
                billingMonth: receiptForm.billingMonth || new Date().toISOString().slice(0, 7),
                dueDate: receiptForm.dueDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage(`✓ Receipt generated! Total: $${total.toLocaleString()} COP`);
            setReceiptForm({ customerId: "", consumption: "", rate: 2850, billingMonth: "", dueDate: "" });
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            console.error("Error generating receipt:", err);
            setMessage("✗ Error generating receipt. Please try again.");
        }
    };

    const handleTicketResponse = async () => {
        if (!response.trim()) {
            setMessage("Please enter a response");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.post(`${API_BASE}/admin/support/respond`, {
                ticketId: selectedTicket.id,
                response: response
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage("✓ Response sent successfully!");
            setSupportTickets(tickets =>
                tickets.map(t => t.id === selectedTicket.id ? { ...t, status: "resolved" } : t)
            );
            setResponse("");
            setSelectedTicket(null);
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            console.error("Error responding to ticket:", err);
            setMessage("✗ Error sending response. Please try again.");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    // Get current month and due date defaults
    const getCurrentMonth = () => {
        const date = new Date();
        return date.toISOString().slice(0, 7);
    };

    const getDefaultDueDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 15);
        return date.toISOString().split('T')[0];
    };

    return (
        <div style={styles.wrapper}>
            <nav style={styles.nav}>
                <div style={{ ...styles.container, ...styles.navContent }}>
                    <div style={styles.logo}>🔧 Admin Panel - Sangil Water</div>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                </div>
            </nav>

            <div style={styles.content}>
                <div style={styles.container}>
                    <div style={styles.pageHeader}>
                        <h1 style={styles.pageTitle}>Admin Dashboard</h1>
                        <p style={styles.pageSubtitle}>Manage customers, statistics, and support</p>
                    </div>

                    {message && (
                        <div style={{
                            ...styles.message,
                            background: message.includes('✓') ? '#d1fae5' : '#fee2e2',
                            color: message.includes('✓') ? '#065f46' : '#991b1b'
                        }}>
                            {message}
                        </div>
                    )}

                    <div style={styles.tabs}>
                        <button
                            style={{ ...styles.tab, ...(activeTab === "stats" && styles.tabActive) }}
                            onClick={() => setActiveTab("stats")}
                        >
                            📊 Update Stats
                        </button>
                        <button
                            style={{ ...styles.tab, ...(activeTab === "receipts" && styles.tabActive) }}
                            onClick={() => setActiveTab("receipts")}
                        >
                            🧾 Generate Receipts
                        </button>
                        <button
                            style={{ ...styles.tab, ...(activeTab === "support" && styles.tabActive) }}
                            onClick={() => setActiveTab("support")}
                        >
                            💬 Support Tickets
                        </button>
                        <button
                            style={{ ...styles.tab, ...(activeTab === "customers" && styles.tabActive) }}
                            onClick={() => setActiveTab("customers")}
                        >
                            👥 Customers
                        </button>
                    </div>

                    <div style={styles.tabContent}>
                        {activeTab === "stats" && (
                            <div style={styles.card}>
                                <h2 style={styles.cardTitle}>Update Customer Statistics</h2>
                                <p style={styles.cardSubtitle}>Enter weekly and monthly consumption data for customers</p>

                                <form onSubmit={handleStatsSubmit} style={styles.form}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Select Customer *</label>
                                        <select
                                            style={styles.input}
                                            value={statsForm.customerId}
                                            onChange={(e) => setStatsForm({ ...statsForm, customerId: e.target.value })}
                                            required
                                        >
                                            <option value="">Choose customer...</option>
                                            {customers.map(c => (
                                                <option key={c.id} value={c.id}>{c.name} - {c.email}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div style={styles.formRow}>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Weekly Consumption (m³) *</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                style={styles.input}
                                                placeholder="45.5"
                                                value={statsForm.weekUsage}
                                                onChange={(e) => setStatsForm({ ...statsForm, weekUsage: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Monthly Consumption (m³) *</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                style={styles.input}
                                                placeholder="185.2"
                                                value={statsForm.monthUsage}
                                                onChange={(e) => setStatsForm({ ...statsForm, monthUsage: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button type="submit" style={styles.submitBtn}>Update Statistics</button>
                                </form>
                            </div>
                        )}

                        {activeTab === "receipts" && (
                            <div style={styles.card}>
                                <h2 style={styles.cardTitle}>Generate Customer Receipt</h2>
                                <p style={styles.cardSubtitle}>Create billing receipts based on consumption</p>

                                <form onSubmit={handleReceiptGenerate} style={styles.form}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Select Customer *</label>
                                        <select
                                            style={styles.input}
                                            value={receiptForm.customerId}
                                            onChange={(e) => setReceiptForm({ ...receiptForm, customerId: e.target.value })}
                                            required
                                        >
                                            <option value="">Choose customer...</option>
                                            {customers.map(c => (
                                                <option key={c.id} value={c.id}>{c.name} - {c.email}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div style={styles.formRow}>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Billing Month</label>
                                            <input
                                                type="month"
                                                style={styles.input}
                                                value={receiptForm.billingMonth || getCurrentMonth()}
                                                onChange={(e) => setReceiptForm({ ...receiptForm, billingMonth: e.target.value })}
                                            />
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Due Date</label>
                                            <input
                                                type="date"
                                                style={styles.input}
                                                value={receiptForm.dueDate || getDefaultDueDate()}
                                                onChange={(e) => setReceiptForm({ ...receiptForm, dueDate: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div style={styles.formRow}>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Consumption (m³) *</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                style={styles.input}
                                                placeholder="185"
                                                value={receiptForm.consumption}
                                                onChange={(e) => setReceiptForm({ ...receiptForm, consumption: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Rate per m³ (COP) *</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                style={styles.input}
                                                value={receiptForm.rate}
                                                onChange={(e) => setReceiptForm({ ...receiptForm, rate: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {receiptForm.consumption && receiptForm.rate && (
                                        <div style={styles.preview}>
                                            <div style={styles.previewLabel}>Total Amount:</div>
                                            <div style={styles.previewAmount}>
                                                ${(parseFloat(receiptForm.consumption) * parseFloat(receiptForm.rate)).toLocaleString()} COP
                                            </div>
                                        </div>
                                    )}

                                    <button type="submit" style={styles.submitBtn}>Generate Receipt</button>
                                </form>
                            </div>
                        )}

                        {activeTab === "support" && (
                            <div style={styles.supportLayout}>
                                <div style={styles.ticketsList}>
                                    <h3 style={styles.sectionTitle}>Support Tickets</h3>
                                    {supportTickets.map(ticket => (
                                        <div
                                            key={ticket.id}
                                            style={{
                                                ...styles.ticketCard,
                                                ...(selectedTicket?.id === ticket.id && styles.ticketCardSelected)
                                            }}
                                            onClick={() => setSelectedTicket(ticket)}
                                        >
                                            <div style={styles.ticketHeader}>
                                                <span style={styles.ticketCustomer}>{ticket.customer_name}</span>
                                                <span style={{
                                                    ...styles.ticketStatus,
                                                    color: ticket.status === 'open' ? '#dc2626' : '#059669'
                                                }}>
                                                    {ticket.status === "open" ? "🔴 Open" : "✓ Resolved"}
                                                </span>
                                            </div>
                                            <div style={styles.ticketSubject}>{ticket.subject}</div>
                                            <div style={styles.ticketDate}>{ticket.date}</div>
                                        </div>
                                    ))}
                                </div>

                                <div style={styles.ticketDetails}>
                                    {selectedTicket ? (
                                        <>
                                            <div style={styles.detailHeader}>
                                                <h3 style={styles.detailTitle}>Ticket Details</h3>
                                                <span style={{
                                                    ...styles.badge,
                                                    background: selectedTicket.status === 'open' ? '#fee2e2' : '#d1fae5',
                                                    color: selectedTicket.status === 'open' ? '#991b1b' : '#065f46'
                                                }}>
                                                    {selectedTicket.status}
                                                </span>
                                            </div>

                                            <div style={styles.detailSection}>
                                                <div style={styles.detailLabel}>Customer:</div>
                                                <div style={styles.detailValue}>{selectedTicket.customer_name}</div>
                                            </div>

                                            <div style={styles.detailSection}>
                                                <div style={styles.detailLabel}>Subject:</div>
                                                <div style={styles.detailValue}>{selectedTicket.subject}</div>
                                            </div>

                                            <div style={styles.detailSection}>
                                                <div style={styles.detailLabel}>Date:</div>
                                                <div style={styles.detailValue}>{selectedTicket.date}</div>
                                            </div>

                                            <div style={styles.messageSection}>
                                                <div style={styles.detailLabel}>Message:</div>
                                                <div style={styles.messageBox}>{selectedTicket.message}</div>
                                            </div>

                                            {selectedTicket.status === "open" && (
                                                <div style={styles.responseSection}>
                                                    <label style={styles.label}>Your Response:</label>
                                                    <textarea
                                                        style={styles.textarea}
                                                        rows="5"
                                                        placeholder="Type your response here..."
                                                        value={response}
                                                        onChange={(e) => setResponse(e.target.value)}
                                                    />
                                                    <button
                                                        style={{
                                                            ...styles.responseBtn,
                                                            opacity: response ? 1 : 0.5
                                                        }}
                                                        onClick={handleTicketResponse}
                                                        disabled={!response}
                                                    >
                                                        Send Response & Close Ticket
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div style={styles.emptyState}>
                                            <div style={styles.emptyIcon}>💬</div>
                                            <h3 style={styles.emptyTitle}>Select a ticket</h3>
                                            <p style={styles.emptyText}>Choose a support ticket to view details and respond</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "customers" && (
                            <div style={styles.card}>
                                <h2 style={styles.cardTitle}>Customer List</h2>
                                <p style={styles.cardSubtitle}>Manage customer accounts and information</p>

                                <div style={styles.tableWrapper}>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr style={styles.tableHeader}>
                                                <th style={styles.th}>Name</th>
                                                <th style={styles.th}>Email</th>
                                                <th style={styles.th}>Phone</th>
                                                <th style={styles.th}>Address</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {customers.map(customer => (
                                                <tr key={customer.id} style={styles.tr}>
                                                    <td style={styles.td}>{customer.name}</td>
                                                    <td style={styles.td}>{customer.email}</td>
                                                    <td style={styles.td}>{customer.phone}</td>
                                                    <td style={styles.td}>{customer.address}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    wrapper: {
        minHeight: '100vh',
        background: '#f5f7fa'
    },
    nav: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '1rem 0',
        boxShadow: '0 2px 20px rgba(0,0,0,0.1)'
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem'
    },
    navContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: 700,
        color: 'white'
    },
    logoutBtn: {
        background: 'rgba(255,255,255,0.2)',
        border: '2px solid white',
        color: 'white',
        padding: '0.5rem 1.25rem',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 600,
        transition: 'all 0.3s'
    },
    content: {
        padding: '2rem 0 4rem 0'
    },
    pageHeader: {
        marginBottom: '2rem'
    },
    pageTitle: {
        fontSize: '2rem',
        margin: '0 0 0.5rem 0',
        color: '#333'
    },
    pageSubtitle: {
        color: '#666',
        margin: 0
    },
    message: {
        padding: '1rem',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        fontWeight: 600,
        textAlign: 'center'
    },
    tabs: {
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        borderBottom: '2px solid #e5e7eb',
        overflowX: 'auto'
    },
    tab: {
        background: 'transparent',
        border: 'none',
        padding: '1rem 1.5rem',
        cursor: 'pointer',
        fontWeight: 600,
        color: '#666',
        borderBottom: '3px solid transparent',
        transition: 'all 0.3s',
        whiteSpace: 'nowrap'
    },
    tabActive: {
        color: '#667eea',
        borderBottomColor: '#667eea'
    },
    tabContent: {
        minHeight: '500px'
    },
    card: {
        background: 'white',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    cardTitle: {
        margin: '0 0 0.5rem 0',
        color: '#333'
    },
    cardSubtitle: {
        color: '#666',
        margin: '0 0 2rem 0'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    },
    formRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem'
    },
    label: {
        fontWeight: 600,
        color: '#333'
    },
    input: {
        padding: '0.875rem',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '1rem',
        transition: 'all 0.3s'
    },
    preview: {
        background: '#f8f9ff',
        padding: '1.5rem',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    previewLabel: {
        fontWeight: 600,
        color: '#333',
        fontSize: '1.1rem'
    },
    previewAmount: {
        fontSize: '1.5rem',
        fontWeight: 700,
        color: '#667eea'
    },
    submitBtn: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        padding: '1rem',
        borderRadius: '12px',
        fontSize: '1.1rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s'
    },
    supportLayout: {
        display: 'grid',
        gridTemplateColumns: '400px 1fr',
        gap: '2rem'
    },
    ticketsList: {},
    sectionTitle: {
        margin: '0 0 1.5rem 0',
        color: '#333'
    },
    ticketCard: {
        background: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '1rem',
        cursor: 'pointer',
        transition: 'all 0.3s',
        border: '2px solid transparent'
    },
    ticketCardSelected: {
        borderColor: '#667eea',
        boxShadow: '0 4px 15px rgba(102,126,234,0.2)'
    },
    ticketHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.75rem'
    },
    ticketCustomer: {
        fontWeight: 700,
        color: '#333'
    },
    ticketStatus: {
        fontSize: '0.85rem',
        fontWeight: 600
    },
    ticketSubject: {
        color: '#667eea',
        marginBottom: '0.5rem'
    },
    ticketDate: {
        fontSize: '0.85rem',
        color: '#999'
    },
    ticketDetails: {
        background: 'white',
        padding: '2rem',
        borderRadius: '16px'
    },
    detailHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '2px solid #f0f0f0'
    },
    detailTitle: {
        margin: 0
    },
    badge: {
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        fontSize: '0.9rem',
        fontWeight: 600
    },
    detailSection: {
        marginBottom: '1.5rem'
    },
    detailLabel: {
        fontWeight: 600,
        color: '#666',
        marginBottom: '0.5rem'
    },
    detailValue: {
        color: '#333',
        fontSize: '1.05rem'
    },
    messageSection: {
        margin: '2rem 0'
    },
    messageBox: {
        background: '#f8f9ff',
        padding: '1.5rem',
        borderRadius: '12px',
        color: '#333',
        lineHeight: '1.6'
    },
    responseSection: {
        marginTop: '2rem'
    },
    textarea: {
        width: '100%',
        padding: '1rem',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        fontFamily: 'inherit',
        fontSize: '1rem',
        resize: 'vertical',
        marginBottom: '1rem',
        minHeight: '120px'
    },
    responseBtn: {
        width: '100%',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: 'white',
        border: 'none',
        padding: '1rem',
        borderRadius: '12px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s'
    },
    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        color: '#999'
    },
    emptyIcon: {
        fontSize: '4rem',
        marginBottom: '1rem',
        opacity: 0.5
    },
    emptyTitle: {
        margin: '0 0 0.5rem 0',
        color: '#666'
    },
    emptyText: {
        margin: 0
    },
    tableWrapper: {
        overflowX: 'auto'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse'
    },
    tableHeader: {
        background: '#f8f9ff'
    },
    th: {
        padding: '1rem',
        textAlign: 'left',
        fontWeight: 600,
        color: '#333',
        borderBottom: '2px solid #e5e7eb'
    },
    tr: {
        transition: 'background 0.3s'
    },
    td: {
        padding: '1rem',
        borderBottom: '1px solid #f0f0f0',
        color: '#666'
    }
};