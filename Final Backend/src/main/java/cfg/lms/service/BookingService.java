package cfg.lms.service;




import cfg.lms.controller.ResponseData;
import cfg.lms.dto.BookingResponseDTO;
import cfg.lms.entity.Booking;
import cfg.lms.entity.ParkingSlot;
import cfg.lms.repository.BookingRepository;
import cfg.lms.repository.ParkingSlotRepository;
import cfg.lms.repository.UserRepository;
import cfg.lms.repository.VehicleRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ParkingSlotRepository slotRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;

    public ResponseData bookSlot(Long userId, String vehicleType, String licensePlate, LocalDateTime start, LocalDateTime end) {
        ResponseData response = new ResponseData();

        try {
            if (end.isBefore(start)) {
                response.setStatus("ERROR");
                response.setMessage("Invalid time range: end time is before start time.");
                return response;
            }

            List<Booking> userBookings = bookingRepository.findUserOverlappingBookings(userId, start, end);
            if (!userBookings.isEmpty()) {
                response.setStatus("ERROR");
                response.setMessage("User already has a booking in this time frame.");
                return response;
            }

            List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(start, end);
            int maxSlots = 2;
            if (overlappingBookings.size() >= maxSlots) {
                response.setStatus("ERROR");
                response.setMessage("No available slot for selected time.");
                return response;
            }

            ParkingSlot slot;
            List<ParkingSlot> available = slotRepository.findByStatus("AVAILABLE");
            if (available.isEmpty()) {
                slot = new ParkingSlot();
            } else {
                slot = available.get(0);
            }

            slot.setStatus("BOOKED");
            slot.setType(vehicleType.toUpperCase());
            slotRepository.save(slot);

            long bookingId;
            do {
                bookingId = 1000 + (long) (Math.random() * 9000);
            } while (bookingRepository.existsByBookingId(bookingId));

            Booking booking = new Booking();
            booking.setBookingId(bookingId);
            booking.setUser(userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found")));
            booking.setSlot(slot);
            booking.setStartTime(start);
            booking.setEndTime(end);
            booking.setStatus("PENDING"); 
            booking.setVehicle(vehicleRepository.findByLicensePlate(licensePlate)
                .orElseThrow(() -> new RuntimeException("Vehicle not found")));

            bookingRepository.save(booking);

            long minutes = java.time.Duration.between(booking.getStartTime(), booking.getEndTime()).toMinutes();
            long hours = (long) Math.ceil(minutes / 60.0); // ✅ round up to next full hour

            if (hours <= 0) hours = 1;

            double rate = switch (vehicleType.toUpperCase()) {
                case "CAR" -> 50;
                case "BIKE" -> 30;
                default -> throw new IllegalArgumentException("Invalid vehicle type. Use CAR or BIKE.");
            };

            double totalFare = rate * hours;

            response.setStatus("SUCCESS");
            response.setMessage("Slot booked successfully!");
            response.setData(new BookingSummary(bookingId, vehicleType.toUpperCase(), hours, totalFare));

        } catch (Exception e) {
            response.setStatus("ERROR");
            response.setMessage("Booking failed: " + e.getMessage());
            response.setData(null);
        }

        return response;
    }

    public List<BookingResponseDTO> getUserBookings(Long userId) {
        List<Booking> bookings = bookingRepository.findByUserUserId(userId);
        return bookings.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private BookingResponseDTO convertToDto(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setBookingId(booking.getBookingId());
        dto.setStart(booking.getStartTime());
        dto.setEnd(booking.getEndTime());
        dto.setStatus(booking.getStatus()); 
        if (booking.getVehicle() != null) {
            dto.setLicensePlate(booking.getVehicle().getLicensePlate());
            dto.setVehicleType(booking.getVehicle().getType());
        }
        return dto;
    }
    public List<BookingResponseDTO> getBookingsForDate(LocalDateTime date) {
        LocalDateTime startOfDay = date.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        List<Booking> bookings = bookingRepository.findByStartTimeBetween(startOfDay, endOfDay);
        return bookings.stream().map(this::convertToDto).collect(Collectors.toList());
    }
    @GetMapping("/booked-slots")
    public List<Map<String, String>> getBookedSlots(@RequestParam String date) {
        LocalDate parsedDate = LocalDate.parse(date);
        LocalDateTime startOfDay = parsedDate.atStartOfDay();
        LocalDateTime endOfDay = parsedDate.plusDays(1).atStartOfDay();

        List<Booking> bookings = bookingRepository.findByStartTimeBetween(startOfDay, endOfDay);

        return bookings.stream()
            .map(b -> Map.of(
                "start", b.getStartTime().toString(),
                "end", b.getEndTime().toString()
            ))
            .collect(Collectors.toList());
    }
    public List<Booking> findBookingsInDateRange(LocalDateTime start, LocalDateTime end) {
        return bookingRepository.findByStartTimeBetween(start, end);
    }

    @Data
    @AllArgsConstructor
    static class BookingSummary {
        private long bookingId;
        private String vehicle;
        private long totalHours;
        private double totalFare;
    }
}
