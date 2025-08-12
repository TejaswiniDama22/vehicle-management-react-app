package cfg.lms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReportRequest {
	@NotNull(message = "User ID is required")
    private Long userId;
	
	 @NotBlank(message = "Description cannot be blank")
    private String description;
}