package cfg.lms.controller;


import cfg.lms.entity.*;
import cfg.lms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final ParkingSlotRepository slotRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final ReportRepository reportRepository;

    @GetMapping("/users")
    public ResponseEntity<ResponseData> getAllUsers() {
        List<User> users = userRepository.findAll();
        return buildSuccessResponse("Users fetched successfully", users);
    }

    @GetMapping("/vehicles")
    public ResponseEntity<ResponseData> getAllVehicles() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        return buildSuccessResponse("Vehicles fetched successfully", vehicles);
    }

    @GetMapping("/slots")
    public ResponseEntity<ResponseData> getAllSlots() {
        List<ParkingSlot> slots = slotRepository.findAll();
        return buildSuccessResponse("Parking slots fetched successfully", slots);
    }

    @GetMapping("/bookings")
    public ResponseEntity<ResponseData> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        return buildSuccessResponse("Bookings fetched successfully", bookings);
    }

    @GetMapping("/payments")
    public ResponseEntity<ResponseData> getAllPayments() {
        List<Payment> payments = paymentRepository.findAll();
        return buildSuccessResponse("Payments fetched successfully", payments);
    }
    
    @GetMapping("/reports")
    public ResponseEntity<ResponseData> getAllReports() {
        List<Report> reports = reportRepository.findAll();
        return buildSuccessResponse("Reports fetched successfully", reports);
    }
//    @PutMapping("/booking/{id}/status")
//    public ResponseEntity<ResponseData> updateBookingStatus(@PathVariable Long id, @RequestParam String status) {
//        try {
//            Booking booking = bookingRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Booking not found"));
//            booking.setStatus(status.toUpperCase()); // Ensure consistent format
//            bookingRepository.save(booking);
//            return buildSuccessResponse("Booking status updated successfully", booking);
//        } catch (Exception e) {
//            return buildErrorResponse("Failed to update booking status: " + e.getMessage());
//        }
//    }
        
    @PutMapping("/booking/{id}/status")
    public ResponseEntity<ResponseData> updateBookingStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String status = body.get("status");
            Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

            // Optional: Block status change after BOOKED
            if ("BOOKED".equalsIgnoreCase(booking.getStatus())) {
                return buildErrorResponse("Cannot change status after it is marked as BOOKED.");
            }

            booking.setStatus(status.toUpperCase());
            bookingRepository.save(booking);
            return buildSuccessResponse("Booking status updated successfully", booking);
        } catch (Exception e) {
            return buildErrorResponse("Failed to update booking status: " + e.getMessage());
        }
    }

    @DeleteMapping("/booking/{id}")
    public ResponseEntity<ResponseData> deleteBooking(@PathVariable Long id) {
        try {
            bookingRepository.deleteById(id);
            return buildSuccessResponse("Booking deleted by admin.", null);
        } catch (Exception e) {
            return buildErrorResponse("Failed to delete booking: " + e.getMessage());
        }
    }
    @DeleteMapping("/payment/{paymentId}")
    public ResponseEntity<ResponseData> deletePayment(@PathVariable Long paymentId) {
        ResponseData response = new ResponseData();

        if (!paymentRepository.existsById(paymentId)) {
            response.setStatus("ERROR");
            response.setMessage("Payment with ID " + paymentId + " not found.");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            paymentRepository.deleteById(paymentId);
            response.setStatus("SUCCESS");
            response.setMessage("Payment with ID " + paymentId + " deleted successfully.");
            response.setData(null);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.setStatus("ERROR");
            response.setMessage("Failed to delete payment: " + e.getMessage());
            response.setData(null);
            return ResponseEntity.status(500).body(response);
        }
    }
    @DeleteMapping("/vehicle/{vehicleId}")
    public ResponseEntity<ResponseData> deleteVehicle(@PathVariable Long vehicleId) {
        if (!vehicleRepository.existsById(vehicleId)) {
            return buildErrorResponse("Vehicle with ID " + vehicleId + " not found.");
        }

        try {
            vehicleRepository.deleteById(vehicleId);
            return buildSuccessResponse("Vehicle deleted successfully.", null);
        } catch (Exception e) {
            return buildErrorResponse("Failed to delete vehicle: " + e.getMessage());
        }
    }

    @DeleteMapping("/report/{reportId}")
    public ResponseEntity<ResponseData> deleteReport(@PathVariable Long reportId) {
        if (!reportRepository.existsById(reportId)) {
            return buildErrorResponse("Report with ID " + reportId + " not found.");
        }

        try {
            reportRepository.deleteById(reportId);
            return buildSuccessResponse("Report deleted successfully.", null);
        } catch (Exception e) {
            return buildErrorResponse("Failed to delete report: " + e.getMessage());
        }
    }

    
    private ResponseEntity<ResponseData> buildSuccessResponse(String message, Object data) {
        ResponseData response = new ResponseData();
        response.setStatus("SUCCESS");
        response.setMessage(message);
        response.setData(data);
        return ResponseEntity.ok(response);
    }

    private ResponseEntity<ResponseData> buildErrorResponse(String errorMessage) {
        ResponseData response = new ResponseData();
        response.setStatus("ERROR");
        response.setMessage(errorMessage);
        response.setData(null);
        return ResponseEntity.badRequest().body(response);
    }
}