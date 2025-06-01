import React, { useState, useEffect } from 'react';

const Receptionist = () => {
  const [formData, setFormData] = useState({
    client: {
      firstName: '',
      lastName: '',
      phone: '',
      email: ''
    },
    deceased: {
      firstName: '',
      lastName: '',
      birthDate: '',
      deathDate: '',
      deathCertificateNumber: ''
    }
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('https://springboot-backend-hnmc.onrender.com/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch user data');
        const userData = await response.json();
        setCurrentUser(userData);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      client: { ...prev.client, [name]: value }
    }));
  };

  const handleDeceasedChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      deceased: { ...prev.deceased, [name]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    const token = localStorage.getItem('token');

    try {
      // Create Client
      const clientResponse = await fetch('https://springboot-backend-hnmc.onrender.com/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData.client)
      });

      if (!clientResponse.ok) throw new Error('Błąd podczas tworzenia klienta');
      const client = await clientResponse.json();

      // Helper function to convert date to datetime
      const convertToDateTime = (dateStr) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        // Set time to noon (12:00:00) to avoid timezone issues
        date.setHours(12, 0, 0, 0);
        return date.toISOString();
      };

      // Create Order with all dates properly formatted
      const orderData = {
        cadaverFirstName: formData.deceased.firstName,
        cadaverLastName: formData.deceased.lastName,
        deathCertificateNumber: formData.deceased.deathCertificateNumber,
        birthDate: convertToDateTime(formData.deceased.birthDate),
        deathDate: convertToDateTime(formData.deceased.deathDate),
        client: { id: client.id },
        status: 'pending',
        orderDate: new Date().toISOString(),
        user: { id: currentUser.id }
      };

      const orderResponse = await fetch('https://springboot-backend-hnmc.onrender.com/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!orderResponse.ok) throw new Error('Błąd podczas tworzenia zlecenia');
      
      setSuccess('Zlecenie zostało pomyślnie utworzone!');
      // Reset form
      setFormData({
        client: {
          firstName: '',
          lastName: '',
          phone: '',
          email: ''
        },
        deceased: {
          firstName: '',
          lastName: '',
          birthDate: '',
          deathDate: '',
          deathCertificateNumber: ''
        }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-gray-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-900 text-red-100 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 bg-green-900 text-green-100 rounded-lg">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Data Section */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-700">
              Dane klienta
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Imię</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.client.firstName}
                  onChange={handleClientChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-200"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Nazwisko</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.client.lastName}
                  onChange={handleClientChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-200"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Telefon</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.client.phone}
                  onChange={handleClientChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-200"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.client.email}
                  onChange={handleClientChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-200"
                />
              </div>
            </div>
          </div>

          {/* Deceased Data Section */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-700">
              Dane osoby zmarłej
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Imię</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.deceased.firstName}
                  onChange={handleDeceasedChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-200"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Nazwisko</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.deceased.lastName}
                  onChange={handleDeceasedChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-200"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Data urodzenia</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.deceased.birthDate}
                  onChange={handleDeceasedChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-200"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Data zgonu</label>
                <input
                  type="date"
                  name="deathDate"
                  value={formData.deceased.deathDate}
                  onChange={handleDeceasedChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-200"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Numer aktu zgonu</label>
                <input
                  type="text"
                  name="deathCertificateNumber"
                  value={formData.deceased.deathCertificateNumber}
                  onChange={handleDeceasedChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-200"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-700 hover:bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Przetwarzanie...' : 'Utwórz zlecenie'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Receptionist;