import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // External CSS

const API_URL = "http://localhost:5000/api/todos"; // Update if needed

const App = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Fetch todos from backend
  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add or Update a todo
  const handleSubmit = async () => {
    if (!task.trim()) return;
    try {
      if (editingId) {
        // Update existing todo
        const response = await axios.put(`${API_URL}/${editingId}`, { task });
        setTodos(todos.map(todo => (todo._id === editingId ? response.data : todo)));
        setEditingId(null);
      } else {
        // Add new todo
        const response = await axios.post(API_URL, { task });
        setTodos([...todos, response.data]);
      }
      setTask("");
    } catch (error) {
      console.error("Error adding/updating todo:", error);
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Edit a todo
  const editTodo = (todo) => {
    setTask(todo.task);
    setEditingId(todo._id);
  };

  // Toggle Completed State
  const toggleComplete = async (id, completed) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, { completed: !completed });
      setTodos(todos.map(todo => (todo._id === id ? response.data : todo)));
    } catch (error) {
      console.error("Error toggling completion:", error);
    }
  };

  return (
    <div className="container">
      <h1>To-Do List</h1>

      <div className="input-container">
        <input
          type="text"
          placeholder="Add or Edit a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="input"
        />
        <button onClick={handleSubmit} className="add-button">
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      <ul className="list">
        {todos.map((todo) => (
          <li key={todo._id} className="list-item">
            <span className={todo.completed ? "completed" : ""}>{todo.task}</span>
            <div>
              <button onClick={() => toggleComplete(todo._id, todo.completed)} className="toggle-button">
                {todo.completed ? "Undo" : "Done"}
              </button>
              <button onClick={() => editTodo(todo)} className="edit-button">Edit</button>
              <button onClick={() => deleteTodo(todo._id)} className="delete-button">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
