import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const BASE_URL = 'http://localhost:8080/api/user';

export default function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);

  // Shared fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Register-only field
  const [name, setName] = useState('');

  const [message, setMessage] = useState({ type: '', text: '' });

  const resetFields = () => {
    setEmail('');
    setPassword('');
    setName('');
    setMessage({ type: '', text: '' });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/login`, { email, password });
      if (response.status === 200) {
        localStorage.setItem('user', JSON.stringify(response.data.data || {}));
        setMessage({ type: 'success', text: 'Login successful, redirecting...' });
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Login failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Login failed' });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/register`, { name, email, password });
      if (response.status === 200 || response.status === 201) {
        setMessage({ type: 'success', text: 'Registration successful, please login.' });
        setTimeout(() => {
          setIsRegister(false);
          resetFields();
        }, 1500);
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Registration failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Registration failed' });
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <form
          onSubmit={isRegister ? handleRegister : handleLogin}
          className="login-form"
        >
          <h2>{isRegister ? 'Register' : 'Login'}</h2>

          {message.text && (
            <div className={`message ${message.type === 'error' ? 'error' : 'success'}`}>
              {message.text}
            </div>
          )}

          {isRegister && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="login-input"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />

          <button type="submit" className="login-button">
            {isRegister ? 'Register' : 'Login'}
          </button>

          <p className="toggle-text">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span
              className="toggle-link"
              onClick={() => {
                setIsRegister(!isRegister);
                resetFields();
              }}
              style={{ cursor: 'pointer', color: '#2563eb', fontWeight: '600' }}
            >
              {isRegister ? 'Login here' : 'Register here'}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
