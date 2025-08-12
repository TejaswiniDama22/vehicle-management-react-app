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



## 📸 Screenshots

### 🏠 Home Page


<img width="1322" height="770" alt="image" src="https://github.com/user-attachments/assets/89d4afaa-e371-42fd-ba8a-eb6b98fda569" />

<img width="1318" height="771" alt="image" src="https://github.com/user-attachments/assets/d21db9d9-f3fa-4845-beff-fa00d3006dcd" />




### 🔐 Login Page

<img width="1598" height="769" alt="image" src="https://github.com/user-attachments/assets/5c36c550-7aca-467b-8b39-9c437bc7c840" />


### 📊 User Dashboard

<img width="1583" height="678" alt="image" src="https://github.com/user-attachments/assets/a38004ab-3086-4ea3-8c14-4255401130a9" />

<img width="1338" height="758" alt="image" src="https://github.com/user-attachments/assets/ceba2784-cc15-4c23-a846-11f3609ab9c2" />



### 🚘 Vehicle Registration Page

<img width="1600" height="764" alt="image" src="https://github.com/user-attachments/assets/8f5bce0b-b1d1-492c-9910-3b5a24a3d828" />


### 🅿️ Book Slot Page

<img width="1584" height="691" alt="image" src="https://github.com/user-attachments/assets/f92dbb26-2a0a-40b1-bb2e-5e8c809a154a" />

<img width="1587" height="680" alt="image" src="https://github.com/user-attachments/assets/7253319b-f605-4f37-adeb-c4a40c02ebc0" />



### 📝 Feedback Page

<img width="1595" height="765" alt="image" src="https://github.com/user-attachments/assets/ea363321-3009-4aa3-8721-3899acf31996" />



### 🛡️ Admin Panel
<img width="1599" height="760" alt="image" src="https://github.com/user-attachments/assets/3bb21ff6-3e95-445b-8254-49e063446ec9" />

<img width="1590" height="767" alt="image" src="https://github.com/user-attachments/assets/4f488f61-45c5-46e6-9cb6-58cf811bff1d" />

<img width="1586" height="773" alt="image" src="https://github.com/user-attachments/assets/ebfb3ff9-2e99-4f24-b381-a751c187e6e6" />


---

