import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <nav className="sidebar">
        <h3 className="title">Dashboard</h3>
        <button className="menuItem" onClick={() => navigate('/booking')}>
          Booking
        </button>
      </nav>
      <main className="mainContent">
        <h2>Welcome to Dashboard</h2>
        <p>Click Booking to go to booking page</p>
      </main>
    </div>
  );
}
