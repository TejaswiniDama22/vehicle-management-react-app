package cfg.lms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(schema="VehicleManagement",name="Vehicle")
public class Vehicle {
    @Id 
    private Long vehicleId;
    @Column(unique = true, nullable = false)
    private String licensePlate;
    private String type;

    @ManyToOne
    private User user;
}