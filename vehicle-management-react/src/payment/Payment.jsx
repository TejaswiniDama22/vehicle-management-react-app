import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Payment.css"; // Make sure this file has the CSS I shared

export default function Payment() {
  const [bookingId, setBookingId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  // Auto-fetch amount when bookingId changes
  const onBookingIdChange = async (value) => {
    setBookingId(value);

    if (!value) {
      setAmount("");
      setMessage("Booking ID required");
      setIsError(true);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:8080/api/payment/amount/${value}`
      );
      setAmount(res.data.amount);
      setMessage("");
      setIsError(false);
    } catch (err) {
      setAmount("");
      setMessage("Invalid Booking ID or error fetching amount");
      setIsError(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bookingId) {
      setMessage("Please enter Booking ID");
      setIsError(true);
      return;
    }
    if (!amount) {
      setMessage("Invalid Booking ID or amount not available");
      setIsError(true);
      return;
    }

    const payload = {
      bookingId,
      amount,
      status: "PAID",
    };

    try {
      await axios.post(`http://localhost:8080/api/payment/pay`, payload);

      const res = await axios.get(
        `http://localhost:8080/api/payment/${bookingId}`
      );
      const lastPayment = {
        paymentId: res.data.paymentId,
        bookingId: res.data.bookingId,
        amount: res.data.amount,
        status: res.data.status,
      };

      navigate("/dashboard", { state: { lastPayment } });
    } catch (err) {
      setMessage(err.response?.data?.message || "Payment failed.");
      setIsError(true);
    }
  };

  return (
    <div className="payment-wrapper">
      <div className="payment-container">
        <h2>Payment Portal</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="bookingId">Booking ID</label>
          <input
            type="number"
            id="bookingId"
            value={bookingId}
            placeholder="Enter Booking ID"
            onChange={(e) => onBookingIdChange(e.target.value)}
          />
          {message && isError && message.toLowerCase().includes("booking id") && (
            <div className="message error">{message}</div>
          )}

          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            placeholder="Amount will auto-fill"
            readOnly
          />

          <button type="submit">Pay</button>

          {message && (!isError || !message.toLowerCase().includes("booking id")) && (
            <div className={`message ${isError ? "error" : "success"}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
