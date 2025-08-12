package cfg.lms.service;

import org.springframework.stereotype.Service;
import cfg.lms.entity.Booking;
import cfg.lms.entity.Payment;
import cfg.lms.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    public double calculateFare(Booking booking) {
        long minutes = java.time.Duration.between(booking.getStartTime(), booking.getEndTime()).toMinutes();
        long hours = (long) Math.ceil(minutes / 60.0); // ✅ round up to next full hour

        if (hours <= 0) hours = 1;

        String vehicleType = booking.getVehicle().getType().toUpperCase();

        double rate = switch (vehicleType) {
            case "CAR" -> 50;
            case "BIKE" -> 30;
            default -> throw new IllegalArgumentException("Invalid vehicle type: " + vehicleType);
        };

        return rate * hours;
    }
    public Payment findLastPaymentByUserId(Long userId) {
        return paymentRepository.findTopByBookingUserUserIdOrderByPaymentIdDesc(userId).orElse(null);
    }

}
