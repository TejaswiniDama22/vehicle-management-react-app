import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState({});
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [lastPayment, setLastPayment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(userData);

    // Fetch vehicles for user
    fetch(`http://localhost:8080/api/vehicle/user/${userData.userId}`)
      .then((res) => res.json())
      .then((data) => setVehicles(data))
      .catch((err) => console.error("Failed to fetch vehicles", err));

    // Fetch bookings for user
    fetch(`http://localhost:8080/api/booking/user/${userData.userId}`)
      .then((res) => res.json())
      .then((data) => {
        const bookingPromises = data.map(async (booking) => {
          try {
            const paymentRes = await fetch(
              `http://localhost:8080/api/payment/${booking.bookingId}`
            );
            if (!paymentRes.ok) throw new Error("No payment found");
            const paymentData = await paymentRes.json();
            return { ...booking, paymentStatus: paymentData.status || "PENDING" };
          } catch {
            return { ...booking, paymentStatus: "PENDING" };
          }
        });

        Promise.all(bookingPromises).then((bookingsWithPayment) => {
          setBookings(bookingsWithPayment);
        });
      })
      .catch((err) => console.error("Failed to fetch bookings", err));

    // Fetch last payment summary
    fetch(`http://localhost:8080/api/payment/last/${userData.userId}`)
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Failed to fetch last payment:", res.status, errorText);
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }
        return res.json();
      })
      .then((data) => setLastPayment(data))
      .catch((err) => {
        console.error("Error fetching last payment:", err);
        setLastPayment(null);
      });
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  function makePayment(booking) {
    if (booking.status === "PENDING") {
      alert("Payment not allowed until admin approves your booking.");
      return;
    }
    if (booking.status === "FAILED") {
      alert("This booking has failed. Payment is not allowed.");
      return;
    }
    if (booking.status === "CANCELLED") {
      alert("This booking has been cancelled. Payment is not allowed.");
      return;
    }

    const start = new Date(booking.start);
    const end = new Date(booking.end);
    const durationHours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    const amount = durationHours * 50; // ₹50/hour

    const payment = {
      bookingId: booking.bookingId,
      amount: amount,
    };

    setBookings((prev) =>
      prev.map((b) =>
        b.bookingId === booking.bookingId ? { ...b, paymentStatus: "PAID" } : b
      )
    );

    navigate("/payment", { state: { lastPayment: payment } });
  }

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>🚗 ParkPro</h2>
        <nav>
          <button style={styles.navButton} onClick={() => navigate("/dashboard")}>
            🏠 Dashboard
          </button>
          <button style={styles.navButton} onClick={() => navigate("/vehicleregister")}>
            🚙 Vehicle Register
          </button>
          <button style={styles.navButton} onClick={() => navigate("/booking")}>
            📅 Book Slot
          </button>
          <button style={styles.navButton} onClick={() => navigate("/report")}>
            📊 Report
          </button>
          <button style={styles.navButton} onClick={logout}>
            🚪 Logout
          </button>
        </nav>
      </aside>

      <main style={styles.mainContent}>
        <header style={styles.header}>
          <h1 style={styles.welcome}>Welcome, {user.name}</h1>
        </header>

        {/* User Details */}
        <section>
          <h2 style={styles.sectionTitle}>User Details</h2>
          <div style={styles.card}>
            <p>
              <strong>User ID:</strong> {user.userId}
            </p>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        </section>

        {/* Registered Vehicles */}
        <section>
          <h2 style={styles.sectionTitle}>Registered Vehicles</h2>
          {vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <div key={vehicle.vehicleId} style={styles.card}>
                <p>
                  <strong>Vehicle ID:</strong> {vehicle.vehicleId}
                </p>
                <p>
                  <strong>License Plate:</strong> {vehicle.licensePlate}
                </p>
                <p>
                  <strong>Type:</strong> {vehicle.type}
                </p>
              </div>
            ))
          ) : (
            <div style={styles.card}>
              <p>No registered vehicles found.</p>
            </div>
          )}
        </section>

        {/* Booking Details */}
        <section>
          <h2 style={styles.sectionTitle}>Booking Details</h2>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div key={booking.bookingId} style={styles.card}>
                <p>
                  <strong>Booking ID:</strong> {booking.bookingId}
                </p>
                <p>
                  <strong>Vehicle Type:</strong> {booking.vehicleType}
                </p>
                <p>
                  <strong>License Plate:</strong> {booking.licensePlate}
                </p>
                <p>
                  <strong>Start:</strong> {new Date(booking.start).toLocaleString()}
                </p>
                <p>
                  <strong>End:</strong> {new Date(booking.end).toLocaleString()}
                </p>

                <p>
                  <strong>Booking Status:</strong>{" "}
                  {booking.status === "BOOKED" ? (
                    <>✅ Booked</>
                  ) : booking.status === "FAILED" ? (
                    <>❌ Failed</>
                  ) : booking.status === "CANCELLED" ? (
                    <>🚫 Cancelled</>
                  ) : (
                    <>⏳ Pending For Admin Approval</>
                  )}
                </p>

                <p>
                  <strong>Payment Status:</strong>{" "}
                  {booking.paymentStatus === "PAID" ? <>✅ Paid</> : <>⏳ Payment Pending</>}
                </p>

                {booking.status === "BOOKED" && (
                  <button
                    style={{
                      ...styles.payButton,
                      backgroundColor:
                        booking.paymentStatus === "PAID" ? "#888" : "#1976d2",
                      cursor:
                        booking.paymentStatus === "PAID" ? "not-allowed" : "pointer",
                    }}
                    onClick={() => makePayment(booking)}
                    disabled={booking.paymentStatus === "PAID"}
                  >
                    💳 Make Payment
                  </button>
                )}

                {booking.status === "FAILED" && (
                  <button style={styles.disabledButton} disabled>
                    ❌ Payment Not Allowed
                  </button>
                )}

                {booking.status === "CANCELLED" && (
                  <button style={styles.disabledButton} disabled>
                    🚫 Booking Cancelled
                  </button>
                )}

                {booking.status !== "BOOKED" &&
                  booking.status !== "FAILED" &&
                  booking.status !== "CANCELLED" && (
                    <button style={styles.disabledButton} disabled>
                      ⏳ Waiting For Approval
                    </button>
                  )}
              </div>
            ))
          ) : (
            <div style={styles.card}>
              <p>No bookings found.</p>
            </div>
          )}
        </section>

        {/* Last Payment Summary */}
        {lastPayment && (
          <section>
            <h2 style={styles.sectionTitle}>Last Payment Summary</h2>
            <div style={styles.card}>
              {lastPayment.paymentId ? (
                <>
                  <p>
                    <strong>Payment ID:</strong> {lastPayment.paymentId}
                  </p>
                  <p>
                    <strong>Booking ID:</strong> {lastPayment.bookingId}
                  </p>
                  <p>
                    <strong>Amount:</strong> ₹{lastPayment.amount}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {lastPayment.status === "PAID" ? <>✅ Paid</> : <>⏳ Payment Pending</>}
                  </p>
                </>
              ) : (
                <p>
                  <strong>Status:</strong> ⏳ Payment Pending
                </p>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default Dashboard;

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#e9f0f7",
  },
  sidebar: {
    width: "230px",
    backgroundColor: "#1b2a41",
    color: "#f0f4f8",
    padding: "2rem 1rem",
    boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
  },
  logo: {
    fontSize: "2rem",
    textAlign: "center",
    marginBottom: "2.5rem",
    fontWeight: "700",
    letterSpacing: "1.5px",
  },
  navButton: {
    display: "block",
    width: "100%",
    background: "none",
    border: "none",
    color: "#f0f4f8",
    fontSize: "1.1rem",
    textAlign: "left",
    padding: "0.85rem 1rem",
    marginBottom: "0.7rem",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.3s, color 0.3s",
    fontWeight: "600",
  },
  mainContent: {
    flex: 1,
    padding: "2.5rem 3rem",
    overflowY: "auto",
  },
  header: {
    marginBottom: "2.5rem",
    borderBottom: "2px solid #1976d2",
    paddingBottom: "0.5rem",
  },
  welcome: {
    fontSize: "2.4rem",
    fontWeight: "700",
    color: "#1b2a41",
  },
  sectionTitle: {
    fontSize: "1.8rem",
    fontWeight: "700",
    marginBottom: "1rem",
    marginTop: "2.5rem",
    color: "#1976d2",
    borderLeft: "6px solid #1976d2",
    paddingLeft: "12px",
    boxShadow: "1px 1px 5px rgba(25, 118, 210, 0.2)",
    backgroundColor: "#d9e7ff",
    borderRadius: "4px",
  },
  card: {
    background: "linear-gradient(135deg, #f8fbff, #e1ebfc)",
    borderRadius: "12px",
    padding: "1.8rem",
    marginBottom: "1.5rem",
    boxShadow: "0 8px 20px rgba(25, 118, 210, 0.12)",
    color: "#1b2a41",
    fontWeight: "600",
  },
  payButton: {
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    padding: "0.6rem 1.3rem",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "1.2rem",
    fontWeight: "700",
    fontSize: "1rem",
    transition: "background-color 0.3s, box-shadow 0.3s",
    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.4)",
  },
  disabledButton: {
    backgroundColor: "#bbb",
    color: "#666",
    border: "none",
    padding: "0.6rem 1.3rem",
    borderRadius: "8px",
    marginTop: "1.2rem",
    fontWeight: "700",
    fontSize: "1rem",
    cursor: "not-allowed",
  },
};
