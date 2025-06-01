import React, { useState } from 'react';
import UsersPanel from '../../components/admin/UsersPanel';
import OrdersPanel from '../../components/admin/OrdersPanel';

const Admin = () => {
    const [activePanel, setActivePanel] = useState('users');

    const generateUserReport = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:8080/reports/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ filters: {} }),
            });

            if (!response.ok) {
                throw new Error(`Błąd: ${response.status} ${response.statusText}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            window.open(url);
        } catch (err) {
            console.error("Błąd generowania raportu:", err);
            alert(`Wystąpił błąd: ${err.message}`);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.headerTitle}>Panel Administratora</h1>
                <div style={styles.tabButtons}>
                    <button 
                        style={{
                            ...styles.tabButton,
                            ...(activePanel === 'users' ? styles.activeTab : {})
                        }}
                        onClick={() => setActivePanel('users')}
                    >
                        👥 Użytkownicy
                    </button>
                    <button 
                        style={{
                            ...styles.tabButton,
                            ...(activePanel === 'orders' ? styles.activeTab : {})
                        }}
                        onClick={() => setActivePanel('orders')}
                    >
                        📋 Zamówienia
                    </button>
                </div>

                {/* PDF button dla użytkowników */}
                {activePanel === 'users' && (
                    <div style={{ textAlign: 'center', marginTop: '8px' }}>
                        <button 
                            onClick={generateUserReport}
                            style={{
                                ...styles.tabButton,
                                backgroundColor: '#00aa88'
                            }}
                        >
                            📄 Generuj PDF (Użytkownicy)
                        </button>
                    </div>
                )}
            </div>

            <div style={styles.contentContainer}>
                {activePanel === 'users' ? <UsersPanel /> : <OrdersPanel />}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        minHeight: 'calc(100vh - 40px)',
        color: 'white'
    },
    header: {
        marginBottom: '32px'
    },
    headerTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '24px'
    },
    tabButtons: {
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        marginBottom: '16px',
        flexWrap: 'wrap'
    },
    tabButton: {
        padding: '12px 24px',
        backgroundColor: '#374151', // bg-gray-700
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'all 0.2s ease'
    },
    activeTab: {
        backgroundColor: '#7C3AED' // bg-purple-600
    },
    contentContainer: {
        backgroundColor: '#111827', // bg-gray-900 (darker)
        borderRadius: '8px',
        padding: '24px'
    }
};

export default Admin;
