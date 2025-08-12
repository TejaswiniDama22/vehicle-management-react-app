# 🚗 Vehicle Parking System

A seamless web-based solution to simplify your vehicle parking experience. From user registration to vehicle management, slot booking, and admin approval — everything is handled in just a few clicks.

🔗 **Live Preview (Localhost for Development)**: [http://localhost:5173/](http://localhost:5173/)

---

## 🧭 How It Works

Follow these simple steps to use the Vehicle Parking System:

### 1. 👤 User Login / Registration
- Visit: [http://localhost:5173/login](http://localhost:5173/login)
- Register a new account or log in with your credentials.

---

### 2. 📊 Access Your Dashboard
- After login, you'll be redirected to your personalized dashboard.
- URL: [http://localhost:5173/dashboard](http://localhost:5173/dashboard)
- Here, you can manage your profile, vehicles, and bookings.

---

### 3. 🚘 Register Your Vehicle
- Add your vehicle details easily at:
- [http://localhost:5173/Vehicleregister](http://localhost:5173/Vehicleregister)

---

### 4. 🅿️ Book a Parking Slot
- Select your desired parking slot based on availability.
- Go to: [http://localhost:5173/booking](http://localhost:5173/booking)
- After booking, your request will be **pending approval from the admin**.
- Admin will update the booking status to either:
  - ✅ **Booked**
  - ❌ **Cancelled**
- Once the status shows **Booked**, you can proceed to make the payment.

---

### 5. 📝 Submit Feedback
- Share your experience with us after using the service.
- Visit: [http://localhost:5173/report](http://localhost:5173/report)

---

## 🛡️ Admin Panel

### 🔑 Admin Login
- **Email**: `admin@gmail.com`  
- **Password**: `admin`

### 🧰 Admin Capabilities
- View all registered users and vehicles
- Delete any registered vehicle
- Manage all bookings:
  - Update booking status: **Booked** or **Cancelled**
  - Delete bookings (**only after associated payment is deleted**)
- Delete payment records
- View and manage user feedback

> ⚠️ **Note**: To delete a booking, the admin must **first delete the related payment**, then the booking.

---

## 🔗 Quick Navigation

| Feature              | URL                                                |
|----------------------|-----------------------------------------------------|
| 🏠 Home              | [http://localhost:5173/](http://localhost:5173/)   |
| 🔐 Login/Register    | [http://localhost:5173/login](http://localhost:5173/login) |
| 📊 Dashboard         | [http://localhost:5173/dashboard](http://localhost:5173/dashboard) |
| 🚘 Vehicle Register  | [http://localhost:5173/Vehicleregister](http://localhost:5173/Vehicleregister) |
| 🅿️ Book Slot         | [http://localhost:5173/booking](http://localhost:5173/booking) |
| 📝 Feedback/Report   | [http://localhost:5173/report](http://localhost:5173/report) |

---

## 🎯 Key Features

- ✅ User Registration & Authentication
- 🚗 Vehicle Management
- 📆 Slot Booking with Admin Approval
- 🔄 Booking Status: Pending → Booked / Cancelled
- 💼 Admin Panel for Full Control
- 🗑️ Admin-Controlled Deletion of Vehicles, Payments, and Bookings
- 🗒️ Feedback Submission
- 📱 Clean & Responsive React UI

---

## 🛠️ Tech Stack

### 🔧 Frontend
- **Framework**: React
- **Styling**: Bootstrap / CSS

### 🖥️ Backend
- **Framework**: Spring Boot (Java)
- **Architecture**: RESTful APIs

### 🗃️ Database
- **Apache Derby** (Embedded Java-based Database)

---

> Made with ❤️ for a smarter, more convenient parking experience.

