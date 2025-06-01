export const styles = {
    // Container styles
    container: {
        padding: '20px',
        backgroundColor: '#2a2828',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        maxWidth: '1200px',
        margin: '0 auto',
        color: 'white'
    },
    
    // Header styles
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    },
    headerTitle: {
        fontSize: '24px',
        fontWeight: 'semibold',
        color: 'white'
    },

    // Filter section styles
    filterSection: {
        backgroundColor: '#343434',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '24px'
    },
    filterHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
    },
    filterGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px'
    },

    // Table styles
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
        backgroundColor: '#343434',
        borderRadius: '8px',
        overflow: 'hidden'
    },
    th: {
        padding: '12px',
        textAlign: 'left',
        backgroundColor: '#2f0031',
        color: 'white',
        fontWeight: 'bold'
    },
    td: {
        padding: '12px',
        textAlign: 'left',
        borderBottom: '1px solid #444',
        color: 'white'
    },
    tr: {
        transition: 'background-color 0.3s',
        '&:hover': {
            backgroundColor: '#3a3a3a'
        }
    },

    // Form styles
    form: {
        backgroundColor: '#343434',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
    },
    formGroup: {
        marginBottom: '16px'
    },
    label: {
        display: 'block',
        color: '#9ca3af',
        marginBottom: '4px',
        fontSize: '14px'
    },
    input: {
        width: '100%',
        padding: '8px 12px',
        backgroundColor: '#4b5563',
        border: '1px solid #6b7280',
        borderRadius: '4px',
        color: 'white',
        fontSize: '16px'
    },
    select: {
        width: '100%',
        padding: '8px 12px',
        backgroundColor: '#4b5563',
        border: '1px solid #6b7280',
        borderRadius: '4px',
        color: 'white',
        fontSize: '16px'
    },

    // Button styles
    button: {
        padding: '8px 16px',
        backgroundColor: '#9900ff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        margin: '5px',
        '&:hover': {
            backgroundColor: '#8400db'
        },
        '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed'
        }
    },
    deleteButton: {
        padding: '8px 16px',
        backgroundColor: '#dc2626',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        margin: '5px',
        '&:hover': {
            backgroundColor: '#b91c1c'
        }
    },
    secondaryButton: {
        padding: '8px 16px',
        backgroundColor: '#4b5563',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        margin: '5px',
        '&:hover': {
            backgroundColor: '#374151'
        }
    },

    // Modal/Edit form styles
    editForm: {
        backgroundColor: '#2a2828',
        color: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px',
        margin: '20px auto',
        padding: '20px'
    },

    // Status styles
    statusBadge: {
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'medium'
    },
    statusPending: {
        backgroundColor: '#facc15',
        color: '#black'
    },
    statusInProgress: {
        backgroundColor: '#3b82f6',
        color: 'white'
    },
    statusCompleted: {
        backgroundColor: '#22c55e',
        color: 'white'
    },
    statusCanceled: {
        backgroundColor: '#ef4444',
        color: 'white'
    },

    // Utility styles
    loading: {
        color: 'white',
        textAlign: 'center',
        padding: '20px'
    },
    error: {
        color: '#ef4444',
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#fee2e2',
        borderRadius: '4px',
        marginBottom: '16px'
    },
    success: {
        color: '#22c55e',
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#dcfce7',
        borderRadius: '4px',
        marginBottom: '16px'
    }
};

export default styles;