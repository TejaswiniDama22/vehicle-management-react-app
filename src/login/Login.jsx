import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:8080/user';

export default function Login() {
  const [isRegister, setIsRegister] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  const handleBlur = (field) => {
    const newErrors = { ...errors };

    if (field === 'name' && !name.trim()) newErrors.name = 'Name is required';
    else if (field === 'email' && !email.trim()) newErrors.email = 'Email is required';
    else if (field === 'password' && (!password.trim() || password.length < 8)) newErrors.password = 'Password must be at least 8 characters';
    else delete newErrors[field];

    setErrors(newErrors);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage(null);

    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!password.trim() || password.length < 8) newErrors.password = 'Password must be at least 8 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/register`, { name, email, password });
      const msg = response.data.message || 'Registered successfully';
      setMessage({ type: 'success', text: msg });
      setIsRegister(false);
      setName('');
      setEmail('');
      setPassword('');
      setErrors({});
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Registration failed' });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(null);
    setErrors({});

    if (!email.trim() || !password.trim()) {
      setErrors({
        email: !email.trim() ? 'Email is required' : '',
        password: !password.trim() ? 'Password is required' : '',
      });
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/login`, { email, password });

      // Fix here: check if status === 'SUCCESS'
      if (response.data && response.data.status === 'SUCCESS' && response.data.data) {
        setMessage({ type: 'success', text: 'Login successful' });

        // Save user details in localStorage for dashboard use
        localStorage.setItem('user', JSON.stringify(response.data.data));

        setEmail('');
        setPassword('');
        setErrors({});
        navigate('/dashboard');  // Redirect to dashboard
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Login failed. Please check your credentials.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Login failed. Please check your credentials.' });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">{isRegister ? 'Register' : 'Login'}</h2>
        <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">
          {isRegister && (
            <div>
              <input
                type="text"
                placeholder="Name"
                className="w-full border p-2 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => handleBlur('name')}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
          )}

          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full border p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur('email')}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full border p-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur('password')}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded">
            {isRegister ? 'Register' : 'Login'}
          </button>

          <p className="text-sm text-center">
            {isRegister ? "Already have an account?" : "Don’t have an account?"}{' '}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => {
                setIsRegister(!isRegister);
                setMessage(null);
                setErrors({});
              }}
            >
              {isRegister ? 'Login' : 'Register'}
            </span>
          </p>

          {message && (
            <p className={`text-sm text-center ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message.text}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
