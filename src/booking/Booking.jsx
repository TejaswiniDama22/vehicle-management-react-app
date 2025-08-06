import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Booking.css';

const BACKEND = 'http://localhost:8080';

const Booking = () => {
    const [userId, setUserId] = useState('');
    const [vehicle, setVehicle] = useState(null);
    const [date, setDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [slots, setSlots] = useState([]);
    const [errors, setErrors] = useState({});

    // Fetch vehicle when user ID is entered or changed
    useEffect(() => {
        if (!userId) {
            setVehicle(null);
            return;
        }

        axios.get(`${BACKEND}/vehicle/by-user/${userId}`)
            .then(res => {
                setVehicle(res.data);
                setErrors(prev => ({ ...prev, vehicle: null, userId: null }));
            })
            .catch(() => {
                setVehicle(null);
                setErrors(prev => ({ ...prev, vehicle: 'No vehicle found for this user' }));
            });
    }, [userId]);

    // Fetch available slots when date is selected
    useEffect(() => {
        if (!date) return;

        axios.get(`${BACKEND}/booking/slots?date=${date}`)
            .then(res => {
                setSlots(res.data.slots || []);
            })
            .catch(() => {
                setSlots([]);
            });
    }, [date]);

    function validate() {
        const newErrors = {};
        if (!userId) newErrors.userId = 'User ID is required';
        if (!vehicle) newErrors.vehicle = 'Vehicle not found for this user';
        if (!date) newErrors.date = 'Date is required';
        if (!selectedSlot) newErrors.selectedSlot = 'Please select a slot';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const [startHour] = selectedSlot.split(':');
        const start = `${date}T${startHour.padStart(2, '0')}:00:00`;
        const end = `${date}T${(parseInt(startHour) + 1).toString().padStart(2, '0')}:00:00`;

        try {
            const res = await axios.post(`${BACKEND}/booking/book`, {
                userId,
                vehicleType: vehicle.type,
                licensePlate: vehicle.licensePlate,
                start,
                end
            });
            alert(res.data.message);
        } catch (err) {
            alert('Booking failed: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="bookingContainer">
            <h2>📅 Book a Slot</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>User ID:</label>
                    <input
                        type="number"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="Enter User ID"
                    />
                    {errors.userId && <div style={{ color: 'red' }}>{errors.userId}</div>}
                    {errors.vehicle && <div style={{ color: 'red' }}>{errors.vehicle}</div>}
                </div>

                <div>
                    <label>Vehicle Type:</label>
                    <input type="text" value={vehicle?.type || ''} readOnly />
                </div>

                <div>
                    <label>License Plate:</label>
                    <input type="text" value={vehicle?.licensePlate || ''} readOnly />
                </div>

                <div>
                    <label>Date:</label>
                    <input
                        type="date"
                        value={date}
                        onChange={e => {
                            setDate(e.target.value);
                            setSelectedSlot('');
                        }}
                    />
                    {errors.date && <div style={{ color: 'red' }}>{errors.date}</div>}
                </div>

                <div>
                    <label>Slot:</label>
                    <select
                        value={selectedSlot}
                        onChange={e => setSelectedSlot(e.target.value)}
                        disabled={!date || slots.length === 0}
                    >
                        <option value="">-- Select Slot --</option>
                        {slots.map(slot => {
                            const isFull = slot.includes('(FULL)');
                            const hour = slot.split(':')[0]; // to extract hour for backend
                            return (
                                <option key={slot} value={hour} disabled={isFull}>
                                    {slot}
                                </option>
                            );
                        })}
                    </select>
                    {errors.selectedSlot && <div style={{ color: 'red' }}>{errors.selectedSlot}</div>}
                </div>

                <button
                    type="submit"
                    className="bookButton"
                    disabled={!selectedSlot || !vehicle}
                >
                    Confirm Booking
                </button>
            </form>
        </div>
    );
};

export default Booking;
