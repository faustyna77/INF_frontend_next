import { useEffect, useState } from "react";

const TaskPlans = () => {
  const [tasks, setTasks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    taskName: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'pending',
    orderId: '',
    employeeId: ''
  });

  // Filter states
  const [filterOrderId, setFilterOrderId] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterEmployee, setFilterEmployee] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterName, setFilterName] = useState("");

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/users", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch employees");
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/tasks", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch tasks: ${res.status}`);
      }
      
      const text = await res.text();
      console.log('Raw response:', text); // Debug raw response
      
      try {
        const data = JSON.parse(text);
        console.log('Parsed data:', data); // Debug parsed data
        setTasks(data);
      } catch (parseError) {
        console.error('JSON Parse error:', parseError);
        console.log('Invalid JSON:', text);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/orders", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchOrders();
    fetchEmployees();
  }, []);

  const resetForm = () => {
    setFormData({
      taskName: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      status: 'pending',
      orderId: '',
      employeeId: ''
    });
  };
  
  const handleAddTask = async () => {
    const token = localStorage.getItem("token");
  
    try {
        const taskData = {
            taskName: formData.taskName,
            description: formData.description,
            priority: formData.priority,
            status: formData.status,
            dueDate: formData.dueDate,
            order: formData.orderId ? { id: parseInt(formData.orderId) } : null,
            assignedUser: formData.employeeId ? { id: parseInt(formData.employeeId) } : null
        };

        console.log('Sending task data:', taskData);

        const res = await fetch("http://localhost:8080/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(taskData)
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Error response:', errorText);
            throw new Error(`Failed to add task: ${res.status} ${errorText}`);
        }

        const newTask = await res.json();
        console.log('New task response:', newTask);

        // Fetch the complete task data after creation
        const completeTaskRes = await fetch(`http://localhost:8080/tasks/${newTask.id}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        if (!completeTaskRes.ok) {
            throw new Error('Failed to fetch complete task data');
        }

        const completeTask = await completeTaskRes.json();
        console.log('Complete task data:', completeTask);

        setTasks(prev => [...prev, completeTask]);
        resetForm();
    } catch (err) {
        console.error("Error adding task:", err);
        alert(`Error adding task: ${err.message}`);
    }
};
  
  const handleEditTask = async (taskId) => {
    const token = localStorage.getItem("token");
  
    try {
      const taskData = {
        taskName: formData.taskName,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate,
        order: formData.orderId ? { id: parseInt(formData.orderId) } : null,
        assignedUser: formData.employeeId ? { id: parseInt(formData.employeeId) } : null
      };
      
      console.log('Updating task:', taskId, 'with data:', taskData);
  
      const res = await fetch(`http://localhost:8080/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(taskData),
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to update task: ${res.status} ${errorText}`);
      }
  
      const text = await res.text();
      console.log('Raw response:', text);
      
      const updatedTask = JSON.parse(text);
      console.log('Parsed updated task:', updatedTask);
      
      setTasks(prev =>
        prev.map(task => task.id === taskId ? updatedTask : task)
      );
      setEditingTask(null);
      resetForm();
    } catch (err) {
      console.error("Error updating task:", err);
      alert(`Error updating task: ${err.message}`);
    }
  };
  
  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem("token");
  
    try {
      const res = await fetch(`http://localhost:8080/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!res.ok) throw new Error("Błąd przy usuwaniu zadania");
  
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error("Błąd usuwania zadania:", err);
    }
  };
  
  const resetFilters = () => {
    setFilterOrderId("");
    setFilterStatus("");
    setFilterPriority("");
    setFilterEmployee("");
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterName("");
  };
  
  const generateReport = async () => {
    const token = localStorage.getItem("token");
  
    try {
      const response = await fetch("http://localhost:8080/reports/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          filters: {
            orderId: filterOrderId ? Number(filterOrderId) : null,
            status: filterStatus || null,
            priority: filterPriority || null,
            employeeId: filterEmployee ? Number(filterEmployee) : null,
            dateFrom: filterDateFrom || null,
            dateTo: filterDateTo || null,
            name: filterName || null
          }
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Błąd: ${response.status} ${response.statusText}`);
      }
  
      // Create blob and open PDF in new window
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    } catch (err) {
      console.error("Błąd przy generowaniu raportu:", err);
      alert(`Wystąpił błąd podczas generowania raportu: ${err.message}`);
    }
  };

const filteredTasks = tasks.filter(task => {
    // Filter by name
    if (filterName && !task.taskName.toLowerCase().includes(filterName.toLowerCase())) {
        return false;
    }

    // Filter by order
    if (filterOrderId && (!task.order || task.order.id !== parseInt(filterOrderId))) {
        return false;
    }

    // Filter by status
    if (filterStatus && task.status !== filterStatus) {
        return false;
    }

    // Filter by priority
    if (filterPriority && task.priority !== filterPriority) {
        return false;
    }

    // Filter by employee
    if (filterEmployee && (!task.assignedUser || task.assignedUser.id !== parseInt(filterEmployee))) {
        return false;
    }

    // Filter by date range
    if (filterDateFrom && task.dueDate) {
        const taskDate = new Date(task.dueDate);
        const fromDate = new Date(filterDateFrom);
        if (taskDate < fromDate) {
            return false;
        }
    }

    if (filterDateTo && task.dueDate) {
        const taskDate = new Date(task.dueDate);
        const toDate = new Date(filterDateTo);
        toDate.setHours(23, 59, 59); // Include the entire day
        if (taskDate > toDate) {
            return false;
        }
    }

    return true;
});

  const handleEditClick = (task) => {
    setEditingTask(task);
    setFormData({
      taskName: task.taskName || '',
      description: task.description || '',
      dueDate: task.dueDate ? task.dueDate.substring(0, 16) : '',
      priority: task.priority || 'medium',
      status: task.status || 'pending',
      orderId: task.order?.id || '',
      employeeId: task.assignedUser?.id || ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

 const handleSaveChanges = async () => {
  const token = localStorage.getItem("token");

  try {
    const formattedDueDate = formData.dueDate
      ? new Date(formData.dueDate).toISOString()
      : null;

    const taskData = {
      id: editingTask.id,
      taskName: formData.taskName,
      description: formData.description,
      priority: formData.priority,
      status: formData.status,
      dueDate: formattedDueDate,
      order: formData.orderId ? { id: parseInt(formData.orderId) } : null,
      assignedUser: formData.employeeId ? { id: parseInt(formData.employeeId) } : null
    };

    console.log("Zapisuję zmiany:", taskData);

    const res = await fetch(`http://localhost:8080/tasks/${editingTask.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(taskData)
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Błąd zapisu:", errorText);
      throw new Error(`Nie udało się zaktualizować zadania: ${res.status}`);
    }

    // Odśwież listę po edycji
    await fetchTasks();
    handleCancelEdit();
  } catch (err) {
    console.error("Błąd edycji zadania:", err);
    alert(`Błąd zapisu zadania: ${err.message}`);
  }
};



  const handleCancelEdit = () => {
    setEditingTask(null);
    setFormData({
      taskName: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      status: 'pending',
      orderId: '',
      employeeId: ''
    });
  };

  // Update the order selection in the form JSX
  return (
    <div className="container mx-auto p-4 bg-gray-900 text-gray-100">
      {/* Formularz zadania */}
      <div className="mb-8 bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          {editingTask ? "Edytuj zadanie" : "Dodaj nowe zadanie"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-gray-400 mb-1 text-sm">Nazwa zadania</label>
          <input
            type="text"
            className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-200"
            name="taskName"
            value={formData.taskName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1 text-sm">Opis zadania</label>
          <input
            type="text"
            className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-200"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1 text-sm">Termin wykonania</label>
          <input
            type="datetime-local"
            className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-200"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1 text-sm">Priorytet</label>
          <select
            className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-200"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
          >
            <option value="low">Niski</option>
            <option value="medium">Średni</option>
            <option value="high">Wysoki</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-400 mb-1 text-sm">Status</label>
          <select
            className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-200"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="pending">Oczekujące</option>
            <option value="in_progress">W trakcie</option>
            <option value="completed">Zakończone</option>
            <option value="canceled">Anulowane</option>
          </select>
        </div>
          <div>
            <label className="block text-gray-400 mb-1 text-sm">Zamówienie</label>
            <select
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-200"
              name="orderId"
              value={formData.orderId}
              onChange={handleInputChange}
            >
              <option value="">Brak</option>
              {orders.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.id} - {order.cadaverFirstName} {order.cadaverLastName}
                  {order.deathCertificateNumber && ` (${order.deathCertificateNumber})`}
                </option>
              ))}
            </select>
          </div>
            <div>
            <label className="block text-gray-400 mb-1 text-sm">Pracownik</label>
            <select
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-200"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleInputChange}
            >
              <option value="">Brak</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>
          <div className="flex justify-end">
          {editingTask ? (
            <div className="flex gap-2">
              <button
                onClick={handleCancelEdit}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded"
              >
                Anuluj
              </button>
              <button
                onClick={handleSaveChanges}
                className="bg-blue-700 hover:bg-blue-600 text-white px-6 py-2 rounded"
              >
                Zapisz zmiany
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddTask}
              className="bg-green-700 hover:bg-green-600 text-white px-6 py-2 rounded"
            >
              Dodaj zadanie
            </button>
          )}
        </div>
      </div>

      {/* Filter section */}
      <div className="mb-8 bg-gray-800 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Filtrowanie zaawansowane</h2>
          <div className="flex gap-2">
            <button
              onClick={resetFilters}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
            >
              Resetuj filtry
            </button>
            <button
              onClick={generateReport}
              className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
            >
              Generuj PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-400 mb-1 text-sm">Nazwa zadania</label>
            <input
              type="text"
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-200"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="Filtruj po nazwie..."
            />
          </div>
          
          {/* Order filter dropdown */}
          <div>
            <label className="block text-gray-400 mb-1 text-sm">Zamówienie</label>
            <select
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-200"
              value={filterOrderId}
              onChange={(e) => setFilterOrderId(e.target.value)}
            >
              <option value="">Wszystkie</option>
              {orders.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.id} - {order.cadaverFirstName} {order.cadaverLastName}
                  {order.deathCertificateNumber && ` (${order.deathCertificateNumber})`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-400 mb-1 text-sm">Status</label>
            <select
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-200"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Wszystkie</option>
              <option value="pending">Oczekujące</option>
              <option value="in_progress">W trakcie</option>
              <option value="completed">Zakończone</option>
              <option value="canceled">Anulowane</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 mb-1 text-sm">Priorytet</label>
            <select
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-200"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="">Wszystkie</option>
              <option value="low">Niski</option>
              <option value="medium">Średni</option>
              <option value="high">Wysoki</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 mb-1 text-sm">Pracownik</label>
            <select
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-200"
              value={filterEmployee}
              onChange={(e) => setFilterEmployee(e.target.value)}
            >
              <option value="">Wszyscy</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-gray-400 mb-1 text-sm">Data od</label>
              <input
                type="date"
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-200"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
              />
            </div>
            <div className="flex-1">
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
      </div>

      {/* Task list section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Lista zadań ({filteredTasks.length})
        </h2>

        {filteredTasks.length === 0 ? (
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p>Brak zadań spełniających kryteria filtrowania</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div className="bg-gray-800 rounded-lg shadow overflow-hidden" key={task.id}>
              <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="text-lg font-semibold">{task.taskName}</p>
                  <p className="text-sm text-gray-400">
                    {task.status === "pending" && "Oczekujące"}
                    {task.status === "in_progress" && "W trakcie"}
                    {task.status === "completed" && "Zakończone"}
                    {task.status === "canceled" && "Anulowane"}
                    {" | "}
                    {task.priority === "low" && "Niski priorytet"}
                    {task.priority === "medium" && "Średni priorytet"}
                    {task.priority === "high" && "Wysoki priorytet"}
                  </p>
                  <p className="text-sm text-gray-400">{task.description}</p>
                  <p className="text-sm text-gray-500">
                    Termin: {task.dueDate ? new Date(task.dueDate).toLocaleString('pl-PL') : "nie określono"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Zamówienie: {(task.order?.cadaverFirstName && task.order?.cadaverLastName) ? 
                      `${task.order.cadaverFirstName} ${task.order.cadaverLastName}` : 
                      (task.order?.id ? `ID: ${task.order.id}` : "brak")}
                  </p>
                  <p className="text-sm text-gray-500">
                    Przypisany: {task.assignedUser ? `${task.assignedUser.firstName} ${task.assignedUser.lastName}` : "brak"}
                  </p>
                </div>

                <div className="flex gap-2 mt-2 md:mt-0">
                  <button
                    className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                    onClick={() => handleEditClick(task)}
                  >
                    Edytuj
                  </button>
                  <button
                    className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Usuń
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Edit form */}
        {editingTask && (
          <div className="bg-gray-800 p-6 rounded-lg mt-8">
            <h2 className="text-xl font-semibold mb-4">Edytuj zadanie</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Nazwa zadania</label>
                <input
                  type="text"
                  name="taskName"
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-200"
                  value={formData.taskName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Opis</label>
                <input
                  type="text"
                  name="description"
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-200"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Termin</label>
                <input
                  type="datetime-local"
                  name="dueDate"
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-200"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Priorytet</label>
                <select
                  name="priority"
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-200"
                  value={formData.priority}
                  onChange={handleInputChange}
                >
                  <option value="low">Niski</option>
                  <option value="medium">Średni</option>
                  <option value="high">Wysoki</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Status</label>
                <select
                  name="status"
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-200"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="pending">Oczekujące</option>
                  <option value="in_progress">W trakcie</option>
                  <option value="completed">Zakończone</option>
                  <option value="canceled">Anulowane</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Zamówienie</label>
                <select
                  name="orderId"
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-200"
                  value={formData.orderId}
                  onChange={handleInputChange}
                >
                  <option value="">Brak</option>
                  {orders.map((order) => (
                    <option key={order.id} value={order.id}>
                      {order.id} - {order.cadaverFirstName} {order.cadaverLastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Pracownik</label>
                <select
                  name="employeeId"
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-gray-200"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                >
                  <option value="">Brak</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
                onClick={handleCancelEdit}
              >
                Anuluj
              </button>
              <button
                className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleSaveChanges}
              >
                Zapisz zmiany
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
  );
};

export default TaskPlans;