import React, { useState } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/user';

export default function Login() {
  const [isRegister, setIsRegister] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Register user
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/register`, { name, email, password });
      setMessage(response.data.message || 'Registration successful');
      setIsRegister(false); // Switch to login page after successful registration
      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  // Login (only switch to dashboard, since backend has no login endpoint)
  const handleLogin = (e) => {
    e.preventDefault();
    // Since backend doesn't have login, just check if email/password is not empty
    if (email && password) {
      setMessage('Login successful');
    } else {
      setMessage('Please enter valid credentials');
    }
  };

  return (
    <div style={styles.container}>
      {isRegister ? (
        <form onSubmit={handleRegister} style={styles.form}>
          <h2 style={styles.title}>Register</h2>
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={styles.input} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} required />
          <button type="submit" style={styles.button}>Register</button>
          <p style={styles.toggle}>
            Already have an account?
            <span style={styles.link} onClick={() => { setIsRegister(false); setMessage(''); }}> Login</span>
          </p>
          {message && <p style={styles.message}>{message}</p>}
        </form>
      ) : (
        <form onSubmit={handleLogin} style={styles.form}>
          <h2 style={styles.title}>Login</h2>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} required />
          <button type="submit" style={styles.button}>Login</button>
          <p style={styles.toggle}>
            Don't have an account?
            <span style={styles.link} onClick={() => { setIsRegister(true); setMessage(''); }}> Register</span>
          </p>
          {message && <p style={styles.message}>{message}</p>}
        </form>
      )}
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f0f0' },
  form: { background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', width: '300px', display: 'flex', flexDirection: 'column' },
  title: { textAlign: 'center', marginBottom: '20px' },
  input: { padding: '8px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' },
  button: { padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  toggle: { textAlign: 'center', marginTop: '10px' },
  link: { color: '#007BFF', cursor: 'pointer', marginLeft: '5px' },
  message: { marginTop: '15px', textAlign: 'center', color: 'green', fontWeight: 'bold' },
};
