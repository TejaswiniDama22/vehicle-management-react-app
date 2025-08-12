import React, { useState } from "react";
import "./VehicleRegister.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function VehicleRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: "",
    licensePlate: "",
    vehicleType: ""
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    let newErrors = {};
    if (!formData.userId) newErrors.userId = "User ID is required";
    if (!formData.licensePlate) {
      newErrors.licensePlate = "License plate is required.";
    } else if (!/^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/.test(formData.licensePlate)) {
      newErrors.licensePlate = "Invalid license plate format.";
    }
    if (!formData.vehicleType) newErrors.vehicleType = "Vehicle type is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "licensePlate" ? value.toUpperCase() : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSuccess(false);
    setMessage("");
    if (!validate()) {
      setMessage("Please correct the form errors.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/vehicle/register", formData);

      if (res.status === 200 && res.data?.status === "SUCCESS") {
        setMessage("Vehicle registered successfully!");
        setIsSuccess(true);
        setErrors({});
        // Optional: clear the form
        setFormData({ userId: "", licensePlate: "", vehicleType: "" });

        // Redirect to dashboard after short delay so user sees message
        setTimeout(() => {
          navigate("/dashboard");
        }, 800);
      } else {
        setMessage(res.data.message || "Vehicle registration failed.");
        setIsSuccess(false);
      }
    } catch (err) {
      console.error("Vehicle register error:", err);
      if (err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Vehicle registration failed.");
      }
      setIsSuccess(false);
    }
  };

  return (
    <div className="vehicle-wrapper">
      <div className="vehicle-container">
        <div className="card">
          <h2>
            <i className="fas fa-car-side"></i> Vehicle Registration
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              type="number"
              name="userId"
              placeholder="User ID"
              value={formData.userId}
              onChange={handleChange}
            />
            {errors.userId && (
              <div className="error">
                <small>{errors.userId}</small>
              </div>
            )}

            <input
              type="text"
              name="licensePlate"
              placeholder="License Plate (e.g., TS09AB1234)"
              value={formData.licensePlate}
              onChange={handleChange}
            />
            {errors.licensePlate && (
              <div className="error">
                <small>{errors.licensePlate}</small>
              </div>
            )}

            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select Vehicle Type
              </option>
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
            </select>
            {errors.vehicleType && (
              <div className="error">
                <small>{errors.vehicleType}</small>
              </div>
            )}

            <button type="submit">Register Vehicle</button>
          </form>

          {message && (
            <p className={`message ${isSuccess ? "success" : "error"}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
