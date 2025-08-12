import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUser, FaCar, FaClipboardList, FaCreditCard,
  FaSignOutAlt, FaTrash, FaLock, FaEnvelope, FaChartPie
} from "react-icons/fa";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from "recharts";
import "./Admin.css";

const API_URL = "/api/admin";

const Admin = () => {
  const [tab, setTab] = useState("dashboard");
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  // New state for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState("All");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("All");

  useEffect(() => {
    setLoggedIn(localStorage.getItem("adminLoggedIn") === "true");
  }, []);

  useEffect(() => {
    if (loggedIn) {
      if (tab === "dashboard") fetchAllData();
      else fetchTabData(tab);
    }
  }, [tab, loggedIn]);

  const fetchAllData = async () => {
    try {
      const endpoints = ["users", "vehicles", "bookings", "payments", "reports"];
      const responses = await Promise.all(
        endpoints.map(ep => axios.get(`${API_URL}/${ep}`))
      );

      const mapped = {};
      endpoints.forEach((ep, i) => {
        mapped[ep] = responses[i].data.data || [];
      });
      setAllData(mapped);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const fetchTabData = async (type) => {
    try {
      const response = await axios.get(`${API_URL}/${type}`);
      if (response.data.status === "SUCCESS") {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleDelete = async (type, id) => {
    const endpointMap = {
      users: null,
      vehicles: "vehicle",
      bookings: "booking",
      payments: "payment",
      reports: "report"
    };
    const endpoint = endpointMap[type];
    if (!endpoint) return;

    try {
      const res = await axios.delete(`${API_URL}/${endpoint}/${id}`);
      if (res.data.status === "SUCCESS") {
        alert(`${type.slice(0, -1)} deleted successfully.`);
        fetchTabData(type);
      } else alert(res.data.message);
    } catch {
      alert("Failed to delete item.");
    }
  };

  const handleStatusUpdate = async (id, newStatus, currentStatus) => {
    if (currentStatus === "BOOKED" || currentStatus === "CANCELLED" || newStatus === currentStatus) return;
    try {
      const res = await axios.put(`${API_URL}/booking/${id}/status`, { status: newStatus });
      if (res.data.status === "SUCCESS") {
        alert("Status updated.");
        fetchTabData("bookings");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error("Error updating booking status", err);
    }
  };

  const statusBadge = (status) => {
    return <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>;
  };

  /** Dashboard UI */
  const renderDashboard = () => {
    const { users = [], vehicles = [], bookings = [], payments = [] } = allData;

    const bookingStatusData = [
      { name: "BOOKED", value: bookings.filter(b => b.status === "BOOKED").length },
      { name: "PENDING", value: bookings.filter(b => b.status === "PENDING").length },
      { name: "CANCELLED", value: bookings.filter(b => b.status === "CANCELLED").length }
    ];

    const paymentData = payments.map(p => ({
      name: `Booking ${p.booking?.bookingId || "-"}`,
      amount: p.amount
    }));

    const vehicleTypeData = Object.entries(
      vehicles.reduce((acc, v) => {
        acc[v.type] = (acc[v.type] || 0) + 1;
        return acc;
      }, {})
    ).map(([type, count]) => ({ name: type, value: count }));

    const revenueTrendData = payments.map((p, i) => ({
      month: `M${i + 1}`,
      revenue: p.amount
    }));

    const bookingTrendData = bookings.map((b, i) => ({
      month: `M${i + 1}`,
      bookings: 1
    }));

    const COLORS = ["#4caf50", "#ffc107", "#f44336", "#2196f3", "#9c27b0"];

    return (
      <div className="dashboard-grid">
        {/* Stat Cards */}
        <div className="stat-card">Total Users <span>{users.length}</span></div>
        <div className="stat-card">Total Vehicles <span>{vehicles.length}</span></div>
        <div className="stat-card">Total Bookings <span>{bookings.length}</span></div>
        <div className="stat-card">Total Payments <span>₹{payments.reduce((a, p) => a + p.amount, 0)}</span></div>

        {/* Charts */}
        <div className="chart-card">
          <h3>Bookings by Status</h3>
          <PieChart width={250} height={250}>
            <Pie data={bookingStatusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
              {bookingStatusData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="chart-card">
          <h3>Payments Overview</h3>
          <BarChart width={350} height={250} data={paymentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#2196f3" />
          </BarChart>
        </div>

        <div className="chart-card">
          <h3>Vehicle Types Distribution</h3>
          <PieChart width={250} height={250}>
            <Pie data={vehicleTypeData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
              {vehicleTypeData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="chart-card">
          <h3>Revenue Trend</h3>
          <LineChart width={350} height={250} data={revenueTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#4caf50" strokeWidth={2} />
          </LineChart>
        </div>

        <div className="chart-card">
          <h3>Booking Trend</h3>
          <LineChart width={350} height={250} data={bookingTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="bookings" stroke="#ff9800" strokeWidth={2} />
          </LineChart>
        </div>
      </div>
    );
  };

  /** Search + Filter UI */
  const renderSearchFilterBar = () => {
    return (
      <div style={{ marginBottom: "15px", display: "flex", gap: "10px", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ padding: "8px", flex: "1", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        {tab === "vehicles" && (
          <select value={vehicleTypeFilter} onChange={e => setVehicleTypeFilter(e.target.value)}>
            <option value="All">All Types</option>
            <option value="Car">Car</option>
            <option value="Bike">Bike</option>
          </select>
        )}
        {tab === "bookings" && (
          <select value={bookingStatusFilter} onChange={e => setBookingStatusFilter(e.target.value)}>
            <option value="All">All Status</option>
            <option value="BOOKED">BOOKED</option>
            <option value="PENDING">PENDING</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        )}
      </div>
    );
  };

  /** Table rendering */
  const renderTable = () => {
    if (!data || data.length === 0) return <p>No data available</p>;

    // Apply search & filters
    let filteredData = data.filter(item => {
      const searchStr = searchTerm.toLowerCase();
      const matchesSearch = Object.values(item).some(val =>
        val && val.toString().toLowerCase().includes(searchStr)
      );

      if (tab === "vehicles" && vehicleTypeFilter !== "All") {
        return matchesSearch && item.type === vehicleTypeFilter;
      }
      if (tab === "bookings" && bookingStatusFilter !== "All") {
        return matchesSearch && item.status === bookingStatusFilter;
      }
      return matchesSearch;
    });

    switch (tab) {
      case "users":
        return (
          <>
            {renderSearchFilterBar()}
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>Email</th></tr></thead>
              <tbody>{filteredData.map(u => (<tr key={u.userId}><td>{u.userId}</td><td>{u.name}</td><td>{u.email}</td></tr>))}</tbody>
            </table>
          </>
        );
      case "vehicles":
        return (
          <>
            {renderSearchFilterBar()}
            <table>
              <thead><tr><th>ID</th><th>Plate</th><th>Type</th><th>Action</th></tr></thead>
              <tbody>{filteredData.map(v => (
                <tr key={v.vehicleId}>
                  <td>{v.vehicleId}</td>
                  <td>{v.licensePlate}</td>
                  <td>{v.type}</td>
                  <td><button className="delete-btn small" onClick={() => handleDelete("vehicles", v.vehicleId)}><FaTrash /></button></td>
                </tr>
              ))}</tbody>
            </table>
          </>
        );
      case "bookings":
        return (
          <>
            {renderSearchFilterBar()}
            <table>
              <thead><tr><th>ID</th><th>Vehicle</th><th>Type</th><th>Start</th><th>End</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>{filteredData.map(b => (
                <tr key={b.bookingId}>
                  <td>{b.bookingId}</td>
                  <td>{b.vehicle?.licensePlate}</td>
                  <td>{b.vehicle?.type}</td>
                  <td>{b.startTime}</td>
                  <td>{b.endTime}</td>
                  <td>{(b.status === "BOOKED" || b.status === "CANCELLED") ? statusBadge(b.status) : (
                    <select value={b.status} onChange={(e) => handleStatusUpdate(b.bookingId, e.target.value, b.status)}>
                      <option value="PENDING">PENDING</option>
                      <option value="BOOKED">BOOKED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  )}</td>
                  <td><button className="delete-btn small" onClick={() => handleDelete("bookings", b.bookingId)}><FaTrash /></button></td>
                </tr>
              ))}</tbody>
            </table>
          </>
        );
      case "payments":
        return (
          <>
            {renderSearchFilterBar()}
            <table>
              <thead><tr><th>ID</th><th>Booking</th><th>Amount</th><th>Action</th></tr></thead>
              <tbody>{filteredData.map(p => (
                <tr key={p.paymentId}>
                  <td>{p.paymentId}</td>
                  <td>{p.booking?.bookingId}</td>
                  <td>₹{p.amount}</td>
                  <td><button className="delete-btn small" onClick={() => handleDelete("payments", p.paymentId)}><FaTrash /></button></td>
                </tr>
              ))}</tbody>
            </table>
          </>
        );
      case "reports":
        return (
          <>
            {renderSearchFilterBar()}
            <table>
              <thead><tr><th>ID</th><th>User</th><th>Description</th><th>Action</th></tr></thead>
              <tbody>{filteredData.map(r => (
                <tr key={r.reportId}>
                  <td>{r.reportId}</td>
                  <td>{r.user?.userId}</td>
                  <td>{r.description}</td>
                  <td><button className="delete-btn small" onClick={() => handleDelete("reports", r.reportId)}><FaTrash /></button></td>
                </tr>
              ))}</tbody>
            </table>
          </>
        );
      default:
        return null;
    }
  };

  /** Login Screen */
  if (!loggedIn) {
    return (
      <motion.div className="admin-login" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="login-box">
          <h2>Admin Login</h2>
          <div className="input-group"><FaEnvelope /><input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div className="input-group"><FaLock /><input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /></div>
          <button className="login-btn" onClick={() => {
            if (email === "admin@gmail.com" && password === "admin") {
              setLoggedIn(true);
              localStorage.setItem("adminLoggedIn", "true");
            } else {
              alert("Invalid credentials");
            }
          }}>Login</button>
        </div>
      </motion.div>
    );
  }

  /** Main Dashboard */
  return (
    <motion.div className="admin-dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <aside>
        <h2>Admin Dashboard</h2>
        <ul>
          <li onClick={() => setTab("dashboard")}><FaChartPie /> Dashboard</li>
          <li onClick={() => setTab("users")}><FaUser /> Users</li>
          <li onClick={() => setTab("vehicles")}><FaCar /> Vehicles</li>
          <li onClick={() => setTab("bookings")}><FaClipboardList /> Bookings</li>
          <li onClick={() => setTab("payments")}><FaCreditCard /> Payments</li>
          <li onClick={() => setTab("reports")}><FaClipboardList /> Reports</li>
          <li onClick={() => {
            localStorage.removeItem("adminLoggedIn");
            window.location.reload();
          }}><FaSignOutAlt /> Logout</li>
        </ul>
      </aside>
      <main>
        <h1>{tab.charAt(0).toUpperCase() + tab.slice(1)}</h1>
        <div className="table-wrapper">
          {tab === "dashboard" ? renderDashboard() : renderTable()}
        </div>
      </main>
    </motion.div>
  );
};

export default Admin;
