import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';
import Booking from './booking/Booking';
import Vehicleregister from './vehicleregister/Vehicleregister';
import Login from './login/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/vehicleregister" element={<Vehicleregister />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
