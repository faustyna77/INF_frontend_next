import { useEffect, useState } from "react";

const Raports = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Filters
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterClientName, setFilterClientName] = useState("");

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/orders", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch orders: ${res.status}`);
      }
      
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const generateOrderReport = async (orderId) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/reports/orders/${orderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to generate report: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url);
      setSuccess("Report generated successfully");
    } catch (err) {
      console.error("Error generating report:", err);
      setError("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterClientName("");
  };

  const filteredOrders = orders.filter(order => {
    if (filterClientName && !order.client.lastName.toLowerCase().includes(filterClientName.toLowerCase())) {
      return false;
    }
    
    if (filterDateFrom && new Date(order.orderDate) < new Date(filterDateFrom)) {
      return false;
    }
    
    if (filterDateTo && new Date(order.orderDate) > new Date(filterDateTo)) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-gray-100">
      {error && (
        <div className="p-4 mb-4 bg-red-900 text-red-100 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 mb-4 bg-green-900 text-green-100 rounded-lg">
          {success}
        </div>
      )}

      {/* Filter section */}
      <div className="mb-8 bg-gray-800 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Filtrowanie zamówień</h2>
          <button
            onClick={resetFilters}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
          >
            Resetuj filtry
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-400 mb-1 text-sm">Nazwisko klienta</label>
            <input
              type="text"
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-200"
              value={filterClientName}
              onChange={(e) => setFilterClientName(e.target.value)}
              placeholder="Filtruj po nazwisku..."
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1 text-sm">Data od</label>
            <input
              type="date"
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-200"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1 text-sm">Data do</label>
            <input
              type="date"
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-200"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Orders list */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Lista zamówień ({filteredOrders.length})
        </h2>

        {filteredOrders.length === 0 ? (
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p>Brak zamówień spełniających kryteria filtrowania</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="text-lg font-semibold">
                    Zamówienie #{order.id}
                  </p>
                  <p className="text-sm text-gray-400">
                    Klient: {order.client.firstName} {order.client.lastName}
                  </p>
                  <p className="text-sm text-gray-400">
                    Zmarły: {order.cadaverFirstName} {order.cadaverLastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Data zamówienia: {new Date(order.orderDate).toLocaleString('pl-PL')}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => generateOrderReport(order.id)}
                    disabled={loading}
                    className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Generowanie..." : "Generuj raport"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Raports;