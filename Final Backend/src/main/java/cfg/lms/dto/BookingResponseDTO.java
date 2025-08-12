package cfg.lms.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BookingResponseDTO {
    private Long bookingId;
    private String vehicleType;
    private String licensePlate;
    private LocalDateTime start;
    private LocalDateTime end;
    private String status;
}