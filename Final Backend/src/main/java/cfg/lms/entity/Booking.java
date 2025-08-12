package cfg.lms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(schema = "VehicleManagement", name = "Booking")
public class Booking {
	@Id
	
	@Column(name = "booking_id")
	private Long bookingId;

    @ManyToOne
    @JoinColumn(name = "user_user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "slot_slot_id")
    private ParkingSlot slot;

    @ManyToOne
    @JoinColumn(name = "vehicle_vehicle_id")
    private Vehicle vehicle;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;
    @Column(nullable = false)
    private String status;
}