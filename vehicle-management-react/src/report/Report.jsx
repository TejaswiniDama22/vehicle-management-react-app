import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./report.css";

export default function Report() {
  const [userId, setUserId] = useState("");
  const [description, setDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !description) {
      setErrorMessage("All fields are required");
      setSuccessMessage("");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/report/submit", {
        userId: Number(userId),
        description,
      });

      console.log("Response data:", response.data);

      if (response.data.status === "SUCCESS") {
        setSuccessMessage("Report submitted successfully!");
        setErrorMessage("");
        setUserId("");
        setDescription("");
        console.log("Navigating to dashboard...");
        navigate("/dashboard"); // Immediate navigation on success
      } else {
        if (response.data.message?.toLowerCase().includes("user not found")) {
          setErrorMessage("User does not exist");
        } else {
          setErrorMessage(response.data.message || "Report submission failed");
        }
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Submit report error:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message?.toLowerCase().includes("user not found")
      ) {
        setErrorMessage("User does not exist");
      } else {
        setErrorMessage("Report submission failed");
      }
      setSuccessMessage("");
    }
  };

  return (
    <div className="report-container">
      <div className="report-card">
        <h2>Report Submission</h2>
        <form onSubmit={handleSubmit}>
          <label>User ID:</label>
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter your User ID"
          />

          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description of the issue"
          />

          <button type="submit">Submit Report</button>

          {successMessage && <div className="success">{successMessage}</div>}
          {errorMessage && <div className="error">{errorMessage}</div>}
        </form>
      </div>
    </div>
  );
}
