import React, { useState, useEffect } from 'react';

const TaskWork = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error('No token found');
            }

            console.log('Fetching assigned tasks...');
            const response = await fetch('http://localhost:8080/tasks/assigned', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
                
            if (!response.ok) {
                const text = await response.text();
                console.error('Server response:', text);
                throw new Error(`Failed to fetch tasks: ${response.status}`);
            }

            const data = await response.json();
            console.log('Received tasks:', data); // Debug log
            setTasks(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching tasks:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Debug log whenever tasks change
    useEffect(() => {
        console.log('Tasks state updated:', tasks);
    }, [tasks]);

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const token = localStorage.getItem("token");
            
            // Send status in lowercase
            const updateData = {
                status: newStatus.toLowerCase()
            };

            console.log('Sending status update:', updateData); // Debug log

            const response = await fetch(`http://localhost:8080/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                const text = await response.text();
                console.error('Error response:', text);
                throw new Error('Failed to update task status');
            }

            const updatedTask = await response.json();
            setTasks(prevTasks => prevTasks.map(task => 
                task.id === taskId ? updatedTask : task
            ));
        } catch (err) {
            console.error('Error updating task status:', err);
            setError(err.message);
        }
    };

    const calculateProgress = (task) => {
        if (!task.dueDate || !task.assignedAt) return 0;
        
        const now = new Date();
        const due = new Date(task.dueDate);
        const start = new Date(task.assignedAt);
        
        // If task hasn't started yet
        if (now < start) return 0;
        // If task is overdue
        if (now > due) return 100;
        
        const total = due - start;
        const elapsed = now - start;
        return Math.round((elapsed / total) * 100);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-600';
            case 'in_progress': return 'bg-blue-600';
            case 'canceled': return 'bg-red-600';
            default: return 'bg-yellow-600';
        }
    };

    // Sort tasks by due date
    const sortedTasks = [...tasks].sort((a, b) => {
        // Handle null dates - put them at the end
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        
        // Compare dates
        return new Date(a.dueDate) - new Date(b.dueDate);
    });

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4 bg-gray-900 text-gray-100">
            <h1 className="text-2xl font-bold mb-6">Moje zadania (Pracownik)</h1>
            <div className="bg-gray-800 p-4 rounded-lg">
                {sortedTasks.length === 0 ? (
                    <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                        <p className="text-gray-400">Brak przypisanych zadań.</p>
                    </div>
                ) : (
                    sortedTasks.map(task => (
                        <div key={task.id} className="mt-4 p-4 bg-gray-700 rounded-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-semibold">{task.taskName}</h2>
                                    <p className="text-gray-400">{task.description}</p>
                                </div>
                                <select
                                    className={`${getStatusColor(task.status)} text-white px-2 py-1 rounded`}
                                    value={task.status}
                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                >
                                    <option value="pending">Oczekujące</option>
                                    <option value="in_progress">W trakcie</option>
                                    <option value="completed">Zakończone</option>
                                    <option value="canceled">Anulowane</option>
                                </select>
                            </div>
                            
                            {/* Progress bar */}
                            <div className="mt-4">
                                <div className="w-full bg-gray-600 rounded-full h-2.5">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                        style={{ width: `${calculateProgress(task)}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    Postęp: {calculateProgress(task)}%
                                </p>
                            </div>

                            <div className="mt-2 text-sm text-gray-400">
                                <p>Priorytet: {
                                    task.priority === 'low' ? 'Niski' :
                                    task.priority === 'medium' ? 'Średni' :
                                    'Wysoki'
                                }</p>
                                <p>Termin: {task.dueDate ? new Date(task.dueDate).toLocaleString('pl-PL') : 'Nie określono'}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TaskWork;