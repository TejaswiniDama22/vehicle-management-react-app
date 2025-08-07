import React, { useState } from "react";
import "./VehicleRegister.css";

function Vehicleregister() {
  const [formData, setFormData] = useState({
    userId: "",
    licensePlate: "",
    vehicleType: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!formData.userId) newErrors.userId = "User ID is required.";
    if (!formData.licensePlate) {
      newErrors.licensePlate = "License plate is required.";
    } else if (!/^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/.test(formData.licensePlate)) {
      newErrors.licensePlate = "Invalid license plate format (e.g., TS09AB1234)";
    }
    if (!formData.vehicleType) newErrors.vehicleType = "Vehicle type is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage("");
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch("http://localhost:8080/api/vehicle/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("✅ Vehicle registered successfully!");
        setErrorMessage("");
        setFormData({
          userId: "",
          licensePlate: "",
          vehicleType: "",
        });
      } else {
        const result = await response.json();
        setErrorMessage(`❌ ${result.message || "Registration failed. Please try again."}`);
      }
    } catch (error) {
      setErrorMessage("❌ Error: Could not connect to server.");
    }
  };

  return (
    <div className="vehicle-wrapper">
      <div className="container">
        <div className="card">
          <h2><i className="fas fa-car-side"></i>Vehicle Registration</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">User ID</label>
              <input
                type="number"
                className="form-control"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
              />
              {errors.userId && <div className="text-danger"><small>{errors.userId}</small></div>}
            </div>

            <div className="mb-3">
              <label className="form-label">License Plate</label>
              <input
                type="text"
                className="form-control"
                name="licensePlate"
                placeholder="TS09AB1234"
                value={formData.licensePlate}
                onChange={handleChange}
              />
              {errors.licensePlate && <div className="text-danger"><small>{errors.licensePlate}</small></div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Vehicle Type</label>
              <select
                className="form-select"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
              >
                <option value="">Select Vehicle Type</option>
                <option value="Car">Car</option>
                <option value="Bike">Bike</option>
              </select>
              {errors.vehicleType && <div className="text-danger"><small>{errors.vehicleType}</small></div>}
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Register Vehicle
              </button>
            </div>
          </form>

          {message && <p className="text-success mt-3 text-center">{message}</p>}
          {errorMessage && <p className="text-danger mt-3 text-center">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
}

export default Vehicleregister;