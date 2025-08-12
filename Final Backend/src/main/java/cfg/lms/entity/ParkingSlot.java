package cfg.lms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(schema="VehicleManagement",name="ParkingSlot")
public class ParkingSlot {
    @Id @GeneratedValue
    private Long slotId;
    private String type;
    private String status; 
}