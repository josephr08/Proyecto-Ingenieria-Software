import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
    const [stats, setStats] = useState({ week: 0, month: 0 });
    const [userName, setUserName] = useState("User");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const name = localStorage.getItem("userName");
        if (name) setUserName(name);

        if (!token) {
            navigate("/login");
            return;
        }

        const base = process.env.REACT_APP_API_URL || "http://localhost:5050/api";
        axios.get(`${base}/auth/stats`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => {
                setStats({ week: r.data.week_usage || 0, month: r.data.month_usage || 0 });
                setLoading(false);
            })
            .catch(() => {
                setStats({ week: 45, month: 185 });
                setLoading(false);
            });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div style={styles.wrapper}>
            <nav style={styles.nav}>
                <div style={styles.container}>
                    <div style={styles.navContent}>
                        <div style={styles.logo}>💧 Sangil Water</div>
                        <div style={styles.navMenu}>
                            <Link to="/dashboard" style={{ ...styles.navItem, ...styles.navItemActive }}>Dashboard</Link>
                            <Link to="/receipts" style={styles.navItem}>Receipts</Link>
                            <Link to="/payments" style={styles.navItem}>Payments</Link>
                            <Link to="/contact" style={styles.navItem}>Support</Link>
                        </div>
                        <div style={styles.navUser}>
                            <span style={styles.userName}>{userName}</span>
                            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                        </div>
                    </div>
                </div>
            </nav>

            <div style={styles.content}>
                <div style={styles.container}>
                    <div style={styles.pageHeader}>
                        <h1 style={styles.pageTitle}>Welcome back, {userName}! 👋</h1>
                        <p style={styles.pageSubtitle}>Here's your water consumption overview</p>
                    </div>

                    <div style={styles.statsGrid}>
                        <div style={{ ...styles.statCard, ...styles.statCardPrimary }}>
                            <div style={styles.statIcon}>📊</div>
                            <div style={styles.statContent}>
                                <div style={styles.statLabel}>This Week</div>
                                <div style={styles.statValue}>
                                    {loading ? "..." : `${stats.week} m³`}
                                </div>
                                <div style={{ ...styles.statChange, color: '#10b981' }}>↑ 5% from last week</div>
                            </div>
                        </div>

                        <div style={{ ...styles.statCard, ...styles.statCardSecondary }}>
                            <div style={styles.statIcon}>📈</div>
                            <div style={styles.statContent}>
                                <div style={styles.statLabel}>This Month</div>
                                <div style={styles.statValue}>
                                    {loading ? "..." : `${stats.month} m³`}
                                </div>
                                <div style={{ ...styles.statChange, color: '#ef4444' }}>↓ 2% from last month</div>
                            </div>
                        </div>

                        <div style={{ ...styles.statCard, ...styles.statCardAccent }}>
                            <div style={styles.statIcon}>💰</div>
                            <div style={styles.statContent}>
                                <div style={styles.statLabel}>Pending Balance</div>
                                <div style={styles.statValue}>$45,200</div>
                                <Link to="/payments" style={styles.statAction}>Pay now →</Link>
                            </div>
                        </div>

                        <div style={{ ...styles.statCard, ...styles.statCardInfo }}>
                            <div style={styles.statIcon}>🎯</div>
                            <div style={styles.statContent}>
                                <div style={styles.statLabel}>Daily Average</div>
                                <div style={styles.statValue}>6.4 m³</div>
                                <div style={styles.statChange}>Based on this month</div>
                            </div>
                        </div>
                    </div>

                    <div style={styles.contentGrid}>
                        <div style={styles.chartCard}>
                            <h3 style={styles.chartTitle}>Weekly Consumption</h3>
                            <div style={styles.barChart}>
                                {[
                                    { day: 'Mon', value: 6.2, height: '60%' },
                                    { day: 'Tue', value: 7.8, height: '75%' },
                                    { day: 'Wed', value: 5.7, height: '55%' },
                                    { day: 'Thu', value: 8.3, height: '80%' },
                                    { day: 'Fri', value: 6.7, height: '65%' },
                                    { day: 'Sat', value: 4.7, height: '45%' },
                                    { day: 'Sun', value: 4.1, height: '40%' }
                                ].map((item, idx) => (
                                    <div key={idx} style={styles.barContainer}>
                                        <div style={{ ...styles.bar, height: item.height }}>
                                            <span style={styles.barValue}>{item.value}</span>
                                        </div>
                                        <span style={styles.barLabel}>{item.day}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={styles.quickActions}>
                            <h3 style={styles.actionsTitle}>Quick Actions</h3>
                            <Link to="/receipts" style={styles.actionItem}>
                                <div style={styles.actionIcon}>🧾</div>
                                <div>
                                    <div style={styles.actionTitle}>View Receipts</div>
                                    <div style={styles.actionDesc}>Check billing history</div>
                                </div>
                            </Link>
                            <Link to="/payments" style={styles.actionItem}>
                                <div style={styles.actionIcon}>💳</div>
                                <div>
                                    <div style={styles.actionTitle}>Make Payment</div>
                                    <div style={styles.actionDesc}>Pay your bills online</div>
                                </div>
                            </Link>
                            <Link to="/contact" style={styles.actionItem}>
                                <div style={styles.actionIcon}>💬</div>
                                <div>
                                    <div style={styles.actionTitle}>Contact Support</div>
                                    <div style={styles.actionDesc}>Get help quickly</div>
                                </div>
                            </Link>
                        </div>
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
        background: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 100
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
        color: '#667eea'
    },
    navMenu: {
        display: 'flex',
        gap: '0.5rem'
    },
    navItem: {
        padding: '0.5rem 1rem',
        textDecoration: 'none',
        color: '#666',
        borderRadius: '8px',
        transition: 'all 0.3s'
    },
    navItemActive: {
        background: '#667eea',
        color: 'white'
    },
    navUser: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    },
    userName: {
        fontWeight: 600,
        color: '#333'
    },
    logoutBtn: {
        background: 'transparent',
        border: '2px solid #e5e7eb',
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
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1.5rem',
        marginBottom: '2rem'
    },
    statCard: {
        background: 'white',
        padding: '1.5rem',
        borderRadius: '16px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        transition: 'all 0.3s'
    },
    statCardPrimary: {
        borderLeft: '4px solid #667eea'
    },
    statCardSecondary: {
        borderLeft: '4px solid #8b5cf6'
    },
    statCardAccent: {
        borderLeft: '4px solid #ec4899'
    },
    statCardInfo: {
        borderLeft: '4px solid #06b6d4'
    },
    statIcon: {
        fontSize: '2.5rem'
    },
    statContent: {
        flex: 1
    },
    statLabel: {
        fontSize: '0.9rem',
        color: '#666',
        marginBottom: '0.5rem'
    },
    statValue: {
        fontSize: '2rem',
        fontWeight: 700,
        color: '#333',
        marginBottom: '0.25rem'
    },
    statChange: {
        fontSize: '0.85rem',
        fontWeight: 600
    },
    statAction: {
        color: '#667eea',
        textDecoration: 'none',
        fontSize: '0.9rem',
        fontWeight: 600
    },
    contentGrid: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '2rem'
    },
    chartCard: {
        background: 'white',
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    chartTitle: {
        margin: '0 0 2rem 0',
        color: '#333'
    },
    barChart: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: '1rem',
        height: '250px',
        padding: '1rem 0'
    },
    barContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        height: '100%'
    },
    bar: {
        width: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '8px 8px 0 0',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '0.5rem',
        transition: 'all 0.3s',
        marginTop: 'auto'
    },
    barValue: {
        color: 'white',
        fontSize: '0.85rem',
        fontWeight: 600
    },
    barLabel: {
        fontSize: '0.85rem',
        color: '#666',
        fontWeight: 500
    },
    quickActions: {
        background: 'white',
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    actionsTitle: {
        margin: '0 0 1.5rem 0',
        color: '#333'
    },
    actionItem: {
        display: 'flex',
        gap: '1rem',
        padding: '1rem',
        marginBottom: '0.75rem',
        background: '#f8f9ff',
        borderRadius: '12px',
        textDecoration: 'none',
        transition: 'all 0.3s',
        border: '2px solid transparent'
    },
    actionIcon: {
        fontSize: '2rem'
    },
    actionTitle: {
        fontWeight: 600,
        color: '#333',
        marginBottom: '0.25rem'
    },
    actionDesc: {
        fontSize: '0.85rem',
        color: '#666'
    }
};