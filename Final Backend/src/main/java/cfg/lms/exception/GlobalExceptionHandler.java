package cfg.lms.exception;


import cfg.lms.controller.ResponseData;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ControllerAdvice;

@ControllerAdvice
public class GlobalExceptionHandler {

    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ResponseData> handleValidationException(MethodArgumentNotValidException ex) {
        StringBuilder errorMessages = new StringBuilder();

        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errorMessages.append(error.getField())
                         .append(": ")
                         .append(error.getDefaultMessage())
                         .append("; ");
        });

        ResponseData response = new ResponseData("ERROR", "Validation failed: " + errorMessages.toString(), null);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ResponseData> handleUserAlreadyExists(UserAlreadyExistsException ex) {
        ResponseData response = new ResponseData("ERROR", ex.getMessage(), null);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

   
    @ExceptionHandler(BookingConflictException.class)
    public ResponseEntity<ResponseData> handleBookingConflict(BookingConflictException ex) {
        ResponseData response = new ResponseData("ERROR", ex.getMessage(), null);
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

  
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ResponseData> handleIllegalArgument(IllegalArgumentException ex) {
        ResponseData response = new ResponseData("ERROR", ex.getMessage(), null);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

   
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseData> handleGeneralException(Exception ex) {
        ResponseData response = new ResponseData("ERROR", "Unexpected error: " + ex.getMessage(), null);
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}