import React from 'react';

const Dashboard = () => {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold">Witaj!</h2>
                    <p>To jest Twój główny panel</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;