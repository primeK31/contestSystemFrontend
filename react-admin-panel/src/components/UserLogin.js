// src/App.js
import React, { useState } from "react";
import axios from "axios";

function App() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState("");
    const [message, setMessage] = useState("");

    const register = async () => {
        try {
            await axios.post("https://contestsystembackend.onrender.com/register", { username, password });
            setMessage("Registration successful");
        } catch (error) {
            setMessage("Registration failed");
        }
    };

    const login = async () => {
        try {
            const response = await axios.post("https://contestsystembackend.onrender.com/token_user", new URLSearchParams({ username, password }));
            setToken(response.data.access_token);
            setMessage("Login successful");
        } catch (error) {
            setMessage("Login failed");
        }
    };

    const getProfile = async () => {
        try {
            console.log(token);
            const response = await axios.get("https://contestsystembackend.onrender.com/users/me", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(`Hello ${response.data.username}`);
        } catch (error) {
            setMessage("Failed to fetch profile");
        }
    };

    return (
        <div className="App">
            <h1>Register</h1>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={register}>Register</button>

            <h1>Login</h1>
            <button onClick={login}>Login</button>

            <h1>Profile</h1>
            <button onClick={getProfile}>Get Profile</button>

            <h2>{message}</h2>
        </div>
    );
}

export default App;
