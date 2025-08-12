import { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import Home from './home/Home';
import Admin from './admin/admin';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Vehicleregister from './vehicleregister/Vehicleregister';
import Payment from './payment/Payment'; // ✅ Import Payment component
import Dashboard from './dashboard/Dashboard';
import Booking from './booking/Booking';
import Report from './report/Report';
import Login from './login/Login';
function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
         <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/vehicleregister" element={<Vehicleregister />} />
       
        <Route path="/report" element={<Report />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/payment" element={<Payment />} /> {/* ✅ Payment Route */}
      </Routes>
    </Router>
  );
}

export default App;
