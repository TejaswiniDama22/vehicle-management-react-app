package cfg.lms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(schema="VehicleManagement",name="Report")
public class Report {
    @Id @GeneratedValue
    private Long reportId;

    private String description;

    @ManyToOne
    private User user;
}