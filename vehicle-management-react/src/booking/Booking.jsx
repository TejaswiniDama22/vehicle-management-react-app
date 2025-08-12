import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Booking.css";

const BACKEND_URL = 'http://localhost:8080';

const Booking = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: '',
    licensePlate: '',
    vehicleType: '',
    start: '',
    end: ''
  });

  const [userVehicles, setUserVehicles] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch booked slots when start date changes
  useEffect(() => {
    if (formData.start) {
      const date = formData.start.split('T')[0];
      axios.get(`${BACKEND_URL}/api/booking/booked-slots?date=${date}`)
        .then(res => setBookedSlots(res.data))
        .catch(err => console.error(err));
    }
  }, [formData.start]);

  // When userId input loses focus, fetch vehicles for that user
  const handleUserIdBlur = () => {
    if (!formData.userId) return;

    axios.get(`${BACKEND_URL}/api/vehicle/user/${formData.userId}`)
      .then(res => {
        const vehicles = Array.isArray(res.data) ? res.data : [res.data];
        setUserVehicles(vehicles);

        if (vehicles.length > 0) {
          setFormData(prev => ({
            ...prev,
            licensePlate: vehicles[0].licensePlate || '',
            vehicleType: vehicles[0].type || ''
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            licensePlate: '',
            vehicleType: ''
          }));
        }
      })
      .catch(err => {
        console.error(err);
        setUserVehicles([]);
        setFormData(prev => ({
          ...prev,
          licensePlate: '',
          vehicleType: ''
        }));
      });
  };

  // Handle license plate dropdown change and update vehicle type accordingly
  const handleLicensePlateChange = (e) => {
    const selectedPlate = e.target.value;
    const selectedVehicle = userVehicles.find(v => v.licensePlate === selectedPlate);

    setFormData(prev => ({
      ...prev,
      licensePlate: selectedPlate,
      vehicleType: selectedVehicle ? selectedVehicle.type : ''
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Calculate how many slots are available for a given hour (max 2)
  const getAvailableCount = (hour) => {
    const TOTAL_SLOTS = 2;

    if (!bookedSlots.length || !formData.start) return TOTAL_SLOTS;

    const date = formData.start.split('T')[0];
    const hourStart = new Date(`${date}T${hour}`);
    if (isNaN(hourStart.getTime())) return TOTAL_SLOTS;

    const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000);

    // Exclude CANCELLED bookings from counting against availability
    const overlapping = bookedSlots.filter(slot => {
      if (slot.status === "CANCELLED") return false;
      const slotStart = new Date(slot.start);
      const slotEnd = new Date(slot.end);
      return slotStart < hourEnd && slotEnd > hourStart;
    }).length;

    return Math.max(0, TOTAL_SLOTS - overlapping);
  };

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
        setMessage("Booked slot successfully!");

        setTimeout(() => {
          navigate('/dashboard');  // Navigate to dashboard after booking
        }, 1500);
      })
      .catch(err => {
        setMessage(err.response?.data?.message || 'Booking failed');
      });
  };

  return (
    <div className="booking-wrapper">
      <div className="outer-card">
        <div className="middle-card">
          <div className="inner-card">
            <h2><i className="fas fa-calendar-check"></i> Book Slot</h2>
            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label htmlFor="userId">User ID:</label>
                <input
                  id="userId"
                  type="number"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  onBlur={handleUserIdBlur}
                  required
                  placeholder="Enter your User ID"
                />
              </div>

              <div className="form-group">
                <label htmlFor="licensePlate">License Plate:</label>
                <select
                  id="licensePlate"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleLicensePlateChange}
                  required
                >
                  <option value="" disabled>
                    {userVehicles.length > 0 ? 'Select license plate' : 'No vehicles found'}
                  </option>
                  {userVehicles.map(vehicle => (
                    <option key={vehicle.licensePlate} value={vehicle.licensePlate}>
                      {vehicle.licensePlate}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="vehicleType">Vehicle Type:</label>
                <input
                  id="vehicleType"
                  type="text"
                  name="vehicleType"
                  value={formData.vehicleType}
                  disabled
                  placeholder="Vehicle type"
                />
              </div>

              <div className="form-group">
                <label htmlFor="start">Start Time:</label>
                <input
                  id="start"
                  type="datetime-local"
                  name="start"
                  value={formData.start}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="end">End Time:</label>
                <input
                  id="end"
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
                        className={`slot ${available === 0 ? 'full' : 'available'}`}
                        title={`${available} slot${available !== 1 ? 's' : ''} available`}
                      >
                        {displayHour} - {available} slot{available !== 1 ? 's' : ''}
                      </div>
                    );
                  })}
                </div>
              </div>

              <button type="submit">Book Slot</button>
            </form>

            {message && <p className="message">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;