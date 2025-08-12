package cfg.lms.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cfg.lms.dto.BookingRequest;
import cfg.lms.dto.BookingResponseDTO;
import cfg.lms.entity.Booking;

import cfg.lms.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/booking")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/book")
    public ResponseEntity<ResponseData> bookSlot(@Valid @RequestBody BookingRequest request) {
        ResponseData response = bookingService.bookSlot(
            request.getUserId(),
            request.getVehicleType(),
            request.getLicensePlate(),
            request.getStart(),
            request.getEnd()
        );

        if ("SUCCESS".equals(response.getStatus())) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingResponseDTO>> getUserBookings(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }
    @GetMapping("/booked-slots")
    public List<Map<String, String>> getBookedSlots(@RequestParam String date) {
        LocalDate parsedDate = LocalDate.parse(date);
        LocalDateTime startOfDay = parsedDate.atStartOfDay();
        LocalDateTime endOfDay = parsedDate.plusDays(1).atStartOfDay();

        List<Booking> bookings = bookingService.findBookingsInDateRange(startOfDay, endOfDay);

        // Filter out cancelled bookings
        List<Booking> filteredBookings = bookings.stream()
            .filter(b -> !"CANCELLED".equalsIgnoreCase(b.getStatus()))
            .collect(Collectors.toList());

        return filteredBookings.stream()
                .map(b -> Map.of(
                        "start", b.getStartTime().toString(),
                        "end", b.getEndTime().toString(),
                        "status", b.getStatus()  // optionally include status if needed in frontend
                ))
                .collect(Collectors.toList());
    }
}

