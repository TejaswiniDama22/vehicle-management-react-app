import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Booking.css";

const BACKEND_URL = 'http://localhost:8080';

const Booking = () => {
  const [formData, setFormData] = useState({
    userId: '',
    licensePlate: '',
    vehicleType: '',
    start: '',
    end: ''
  });

  const [vehicle, setVehicle] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [message, setMessage] = useState('');
  const [userBookings, setUserBookings] = useState([]);

  // Fetch all booked slots for selected date (to show availability)
  useEffect(() => {
    if (formData.start) {
      const date = formData.start.split('T')[0];
      axios.get(`${BACKEND_URL}/api/booking/booked-slots?date=${date}`)
        .then(res => setBookedSlots(res.data))
        .catch(err => console.error(err));
    }
  }, [formData.start]);

  // Fetch bookings for user when userId changes
  useEffect(() => {
    if (formData.userId) {
      axios.get(`${BACKEND_URL}/api/booking/user/${formData.userId}`)
        .then(res => setUserBookings(res.data))
        .catch(err => {
          setUserBookings([]);
          console.error(err);
        });
    } else {
      setUserBookings([]);
    }
  }, [formData.userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Autofill vehicle details by userId
  const handleUserIdBlur = () => {
    if (!formData.userId) return;

    axios.get(`${BACKEND_URL}/api/vehicle/user/${formData.userId}`)
      .then(res => {
        const data = res.data;
        const vehicleData = Array.isArray(data) ? data[0] : data;

        if (vehicleData && typeof vehicleData === 'object') {
          setVehicle(vehicleData);
          setFormData(prev => ({
            ...prev,
            licensePlate: vehicleData.licensePlate || '',
            vehicleType: vehicleData.type || ''
          }));
        } else {
          setVehicle(null);
        }
      })
      .catch(err => {
        console.error(err);
        setVehicle(null);
      });
  };

  // Calculate available slots for a given hour
  const getAvailableCount = (hour) => {
    const TOTAL_SLOTS = 2;

    if (!bookedSlots.length || !formData.start) return TOTAL_SLOTS;

    const dateTimeParts = formData.start.split('T');
    if (dateTimeParts.length !== 2) return TOTAL_SLOTS;

    const date = dateTimeParts[0];
    const hourStart = new Date(`${date}T${hour}`);
    if (isNaN(hourStart.getTime())) return TOTAL_SLOTS;

    const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000);

    const overlapping = bookedSlots.filter(slot => {
      const slotStart = new Date(slot.start);
      const slotEnd = new Date(slot.end);
      return slotStart < hourEnd && slotEnd > hourStart;
    }).length;

    return Math.max(0, TOTAL_SLOTS - overlapping);
  };

  // Style for status text
  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED': return { color: 'green', fontWeight: 'bold' };
      case 'REJECTED': return { color: 'red', fontWeight: 'bold' };
      case 'PENDING':
      default: return { color: 'orange', fontWeight: 'bold' };
    }
  };

  // Submit booking form
  const handleSubmit = (e) => {
  e.preventDefault();

  const now = new Date();
  const startDate = new Date(formData.start);
  const endDate = new Date(formData.end);

  if (startDate <= now) {
    setMessage("Start time must be in the future.");
    return;
  }

  if (endDate <= startDate) {
    setMessage("End time must be after start time.");
    return;
  }

  axios.post(`${BACKEND_URL}/api/booking/book`, formData)
    .then(res => {
      setMessage(res.data.message || 'Booking successful!');
      // Refresh bookings
      if (formData.userId) {
        axios.get(`${BACKEND_URL}/api/booking/user/${formData.userId}`)
          .then(res => setUserBookings(res.data))
          .catch(() => setUserBookings([]));
      }
    })
    .catch(err => {
      setMessage(err.response?.data?.message || 'Booking failed');
    });
};


  return (
    <div className="outer-card">
      <div className="middle-card">
        <div className="inner-card">
          <h2>Book a Slot</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>User ID:</label>
              <input
                type="number"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                onBlur={handleUserIdBlur}
                required
              />
            </div>

            <div className="form-group">
              <label>License Plate:</label>
              <input
                type="text"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Vehicle Type:</label>
              <input
                type="text"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Start Time:</label>
              <input
                type="datetime-local"
                name="start"
                value={formData.start}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>End Time:</label>
              <input
                type="datetime-local"
                name="end"
                value={formData.end}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Slot Availability:</label>
              <div className="slot-grid">
                {[...Array(24).keys()].map(hour => {
                  const displayHour = `${hour.toString().padStart(2, '0')}:00`;
                  const available = getAvailableCount(displayHour);
                  return (
                    <div
                      key={hour}
                      className={`slot ${available === 0 ? 'full' : ''}`}
                    >
                      {displayHour} - {available} slots
                    </div>
                  );
                })}
              </div>
            </div>

            <button type="submit">Book Slot</button>
          </form>

          {message && <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>{message}</p>}

          {/* User bookings list */}
          {userBookings.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h3>Your Bookings</h3>
              {userBookings.map(booking => (
                <div
                  key={booking.bookingId}
                  style={{
                    border: '1px solid #ccc',
                    padding: '10px',
                    marginBottom: '8px',
                    borderRadius: '6px'
                  }}
                >
                  <p><strong>Booking ID:</strong> {booking.bookingId}</p>
                  <p><strong>Vehicle:</strong> {booking.vehicleType} ({booking.licensePlate})</p>
                  <p><strong>From:</strong> {new Date(booking.start).toLocaleString()}</p>
                  <p><strong>To:</strong> {new Date(booking.end).toLocaleString()}</p>
                  {booking.status && (
                    <p>
                      <strong>Status:</strong> <span style={getStatusStyle(booking.status)}>{booking.status}</span>
                    </p>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    
    </div>
  );
};

export default Booking;
