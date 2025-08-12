package cfg.lms.vms;

import cfg.lms.entity.Booking;
import cfg.lms.entity.Vehicle;
import cfg.lms.repository.BookingRepository;
import cfg.lms.repository.PaymentRepository;
import cfg.lms.service.PaymentService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private PaymentService paymentService;

    private Booking booking;
    private Vehicle vehicle;

    @BeforeEach
    public void setUp() {
        vehicle = new Vehicle();
        booking = new Booking();
        booking.setVehicle(vehicle);
    }

    @Test
    public void testCalculateFare_Car_2Hours() {
        vehicle.setType("CAR");
        booking.setStartTime(LocalDateTime.now());
        booking.setEndTime(booking.getStartTime().plusHours(2));

        double fare = paymentService.calculateFare(booking);
        assertEquals(100.0, fare); 
    }

    @Test
    public void testCalculateFare_Bike_3Hours() {
        vehicle.setType("BIKE");
        booking.setStartTime(LocalDateTime.now());
        booking.setEndTime(booking.getStartTime().plusHours(3));

        double fare = paymentService.calculateFare(booking);
        assertEquals(90.0, fare); 
    }

    @Test
    public void testCalculateFare_Car_ZeroDuration_MinimumOneHourCharged() {
        vehicle.setType("CAR");
        booking.setStartTime(LocalDateTime.now());
        booking.setEndTime(booking.getStartTime());

        double fare = paymentService.calculateFare(booking);
        assertEquals(50.0, fare); 
    }

    @Test
    public void testCalculateFare_Bike_NegativeDuration_MinimumOneHourCharged() {
        vehicle.setType("BIKE");
        booking.setStartTime(LocalDateTime.now());
        booking.setEndTime(booking.getStartTime().minusHours(1)); 
        double fare = paymentService.calculateFare(booking);
        assertEquals(30.0, fare); 
    }

    @Test
    public void testCalculateFare_InvalidVehicleType_ShouldThrowException() {
        vehicle.setType("TRUCK");
        booking.setStartTime(LocalDateTime.now());
        booking.setEndTime(booking.getStartTime().plusHours(2));

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            paymentService.calculateFare(booking);
        });

        assertTrue(exception.getMessage().contains("Invalid vehicle type"));
    }
}
