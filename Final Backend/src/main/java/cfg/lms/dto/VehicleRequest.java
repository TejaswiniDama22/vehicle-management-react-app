package cfg.lms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class VehicleRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "License plate is required")
    @Pattern(
        regexp = "^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$",
        message = "License plate must follow the format: TS09AB1234"
    )
    private String licensePlate;

    @NotBlank(message = "Vehicle type is required")
    private String vehicleType;
}