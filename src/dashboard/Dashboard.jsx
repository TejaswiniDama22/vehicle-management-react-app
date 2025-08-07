import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState({});
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      navigate("/login");
      return;
    }

    setUser(userData);

    fetch(`http://localhost:8080/api/vehicle/user/${userData.userId}`)
      .then((res) => res.json())
      .then((data) => setVehicles(data))
      .catch((err) => console.error("Failed to fetch vehicles", err));
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>🚗 ParkPro</h2>
        <nav>
          <button style={styles.navButton} onClick={() => navigate("/dashboard")}>🏠 Dashboard</button>
          <button style={styles.navButton} onClick={() => navigate("/vehicleregister")}>🚙 Vehicle Register</button>
          <button style={styles.navButton} onClick={() => navigate("/booking")}>📅 Book Slot</button>
          <button style={styles.navButton} onClick={() => navigate("/report")}>📊 Report</button>
          <button style={styles.navButton} onClick={logout}>🚪 Logout</button>
        </nav>
      </aside>

      <main style={styles.mainContent}>
        <header style={styles.header}>
          <h1 style={styles.welcome}>Welcome, {user.name}</h1>
        </header>

        <section>
          <h2 style={styles.sectionTitle}>User Details</h2>
          <div style={styles.card}>
            <p><strong>User ID:</strong> {user.userId}</p>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        </section>

        <section>
          <h2 style={styles.sectionTitle}>Registered Vehicles</h2>
          {vehicles.length > 0 ? (
            vehicles.map(vehicle => (
              <div key={vehicle.vehicleId} style={styles.card}>
                <p><strong>Vehicle ID:</strong> {vehicle.vehicleId}</p>
                <p><strong>License Plate:</strong> {vehicle.licensePlate}</p>
                <p><strong>Type:</strong> {vehicle.type}</p>
              </div>
            ))
          ) : (
            <div style={styles.card}>
              <p>No registered vehicles found.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Segoe UI, sans-serif",
    backgroundColor: "#f4f6f8",
  },
  sidebar: {
    width: "230px",
    backgroundColor: "#2c3e50",
    color: "#ecf0f1",
    padding: "2rem 1rem",
  },
  logo: {
    fontSize: "1.8rem",
    textAlign: "center",
    marginBottom: "2rem",
  },
  navButton: {
    display: "block",
    width: "100%",
    background: "none",
    border: "none",
    color: "#ecf0f1",
    fontSize: "1rem",
    textAlign: "left",
    padding: "0.75rem 1rem",
    marginBottom: "0.5rem",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  mainContent: {
    flex: 1,
    padding: "2rem",
  },
  header: {
    marginBottom: "2rem",
  },
  welcome: {
    fontSize: "2rem",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: "1rem",
    marginTop: "2rem",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    padding: "1.5rem",
    marginBottom: "1rem",
    boxShadow: "0 0 10px rgba(0,0,0,0.08)",
  },
};
