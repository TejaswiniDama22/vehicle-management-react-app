package cfg.lms.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
	public class PaymentRequest {
	  @NotNull(message = "Booking ID is required")
	    private Long bookingId;
	  @NotNull(message = "Amount is required")
	    @Min(value = 1, message = "Amount must be greater than 0")
	    private Double amount;
	    private String status;
}
