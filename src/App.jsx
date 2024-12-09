import React, { useState, useEffect } from 'react';
import { getTasks, addTask, updateTaskStatus, deleteTask, searchTasks } from './api';

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [newTask, setNewTask] = useState({ name: '', description: '' });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getTasks();
            setTasks(data);
        } catch (err) {
            setError('Failed to load tasks.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async () => {
        if (!newTask.name || !newTask.description) {
            setError('Task name and description are required.');
            return;
        }
        try {
            const task = await addTask(newTask);
            setTasks([...tasks, task]);
            setNewTask({ name: '', description: '' });
        } catch (err) {
            setError('Failed to add task.');
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await deleteTask(taskId);
            setTasks(tasks.filter((task) => task._id !== taskId));
        } catch (err) {
            setError('Failed to delete task.');
        }
    };

    const handleUpdateStatus = async (taskId, status) => {
        try {
            const updatedTask = await updateTaskStatus(taskId, status);
            setTasks(tasks.map((task) => (task._id === taskId ? updatedTask : task)));
        } catch (err) {
            setError('Failed to update task status.');
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            fetchTasks(); // Reload all tasks if search query is empty
            return;
        }
        setLoading(true);
        setError('');
        try {
            const results = await searchTasks(searchQuery);
            setTasks(results);
        } catch (err) {
            setError('Failed to search tasks.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container'>
            <h1>To-Do List</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>&nbsp;&nbsp;
                <button onClick={()=> {setSearchQuery('');fetchTasks()}}>Reset</button>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {tasks.map((task) => (
                        <li key={task._id}>
                            <h3>{task.name}</h3>
                            <p>{task.description}</p>
                            <p>Status: {task.status}</p>
                            <select
                                value={task.status}
                                onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
                            >
                                <option value="Incomplete">Incomplete</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                            <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
            <h2>Add New Task</h2>
            <input
                type="text"
                placeholder="Task Name"
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            />
            <textarea
                placeholder="Task Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <button onClick={handleAddTask}>Add Task</button>
        </div>
    );
};

export default App;
