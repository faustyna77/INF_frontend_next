import React, { useEffect, useState } from 'react';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Brak tokenu. Użytkownik nie jest zalogowany.');
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/users/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) throw new Error('Nie udało się pobrać danych użytkownika');

                const data = await response.json();
                setUser(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUser();
    }, []);

    if (error) {
        return <div className="text-center p-4 bg-red-900 text-red-100 rounded-lg">{error}</div>;
    }

    if (!user) {
        return <div className="text-center p-4">Ładowanie danych użytkownika...</div>;
    }

    return (
        <div className="container mx-auto p-4 bg-gray-900 text-gray-100">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-center">Profil użytkownika</h1>
                
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center border-b border-gray-700 pb-4">
                            <span className="text-gray-400 md:w-1/4">Imię:</span>
                            <span className="font-medium md:w-3/4">{user.firstName}</span>
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:items-center border-b border-gray-700 pb-4">
                            <span className="text-gray-400 md:w-1/4">Nazwisko:</span>
                            <span className="font-medium md:w-3/4">{user.lastName}</span>
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:items-center border-b border-gray-700 pb-4">
                            <span className="text-gray-400 md:w-1/4">Email:</span>
                            <span className="font-medium md:w-3/4">{user.email}</span>
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:items-center">
                            <span className="text-gray-400 md:w-1/4">Rola:</span>
                            <span className="font-medium md:w-3/4">
                                {user.role === 'ADMIN' ? 'Administrator' : 'Pracownik'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;