package cfg.lms.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor

@AllArgsConstructor
@Table(schema = "VehicleManagement", name = "Payment")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Long paymentId;

    @OneToOne
    private Booking booking;

    private Double amount;

    private String status; // "PAID", "PENDING", etc.
}
