package cfg.lms.vms;





import cfg.lms.controller.ResponseData;
import cfg.lms.entity.*;
import cfg.lms.repository.*;
import cfg.lms.service.BookingService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
public class BookingServiceTest {

    @Mock private BookingRepository bookingRepository;
    @Mock private ParkingSlotRepository slotRepository;
    @Mock private UserRepository userRepository;
    @Mock private VehicleRepository vehicleRepository;

    @InjectMocks
    private BookingService bookingService;

    private User user;
    private Vehicle vehicle;
    private ParkingSlot slot;
    private LocalDateTime start;
    private LocalDateTime end;

    @BeforeEach
    public void setup() {
        user = new User();
        user.setUserId(1L);
        user.setName("Test User");

        vehicle = new Vehicle();
        vehicle.setLicensePlate("ABC123");
        vehicle.setType("CAR");
        vehicle.setUser(user);

        slot = new ParkingSlot();
        slot.setSlotId(1L);
        slot.setStatus("AVAILABLE");
        slot.setType("CAR");

        start = LocalDateTime.now().plusHours(1);
        end = start.plusHours(2);
    }

    @Test
    public void testBookSlot_Success() {
        when(bookingRepository.findUserOverlappingBookings(1L, start, end)).thenReturn(List.of());
        when(bookingRepository.findOverlappingBookings(start, end)).thenReturn(List.of());
        when(slotRepository.findByStatus("AVAILABLE")).thenReturn(List.of(slot));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(vehicleRepository.findByLicensePlate("ABC123")).thenReturn(Optional.of(vehicle));
        when(bookingRepository.existsByBookingId(anyLong())).thenReturn(false);

        ResponseData response = bookingService.bookSlot(1L, "CAR", "ABC123", start, end);

        assertEquals("SUCCESS", response.getStatus());
        assertTrue(response.getMessage().contains("Slot booked successfully"));
        assertNotNull(response.getData());
    }

    @Test
    public void testBookSlot_InvalidTime() {
        LocalDateTime invalidEnd = start.minusHours(2);

        ResponseData response = bookingService.bookSlot(1L, "CAR", "ABC123", start, invalidEnd);

        assertEquals("ERROR", response.getStatus());
        assertTrue(response.getMessage().contains("Invalid time range"));
    }

    @Test
    public void testBookSlot_UserAlreadyHasBooking() {
        when(bookingRepository.findUserOverlappingBookings(1L, start, end))
            .thenReturn(List.of(new Booking()));

        ResponseData response = bookingService.bookSlot(1L, "CAR", "ABC123", start, end);

        assertEquals("ERROR", response.getStatus());
        assertTrue(response.getMessage().contains("already has a booking"));
    }

    @Test
    public void testBookSlot_NoSlotsAvailable() {
        when(bookingRepository.findUserOverlappingBookings(1L, start, end)).thenReturn(List.of());
        when(bookingRepository.findOverlappingBookings(start, end))
            .thenReturn(List.of(new Booking(), new Booking(), new Booking(), new Booking(),
                                new Booking(), new Booking(), new Booking(), new Booking(),
                                new Booking(), new Booking())); // 10 bookings

        ResponseData response = bookingService.bookSlot(1L, "CAR", "ABC123", start, end);

        assertEquals("ERROR", response.getStatus());
        assertTrue(response.getMessage().contains("No available slot"));
    }

    @Test
    public void testBookSlot_InvalidVehicleType() {
        when(bookingRepository.findUserOverlappingBookings(1L, start, end)).thenReturn(List.of());
        when(bookingRepository.findOverlappingBookings(start, end)).thenReturn(List.of());
        when(slotRepository.findByStatus("AVAILABLE")).thenReturn(List.of(slot));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(vehicleRepository.findByLicensePlate("ABC123")).thenReturn(Optional.of(vehicle));
        when(bookingRepository.existsByBookingId(anyLong())).thenReturn(false);

        ResponseData response = bookingService.bookSlot(1L, "TRUCK", "ABC123", start, end);

        assertEquals("ERROR", response.getStatus());
        assertTrue(response.getMessage().contains("Invalid vehicle type"));
    }

    @Test
    public void testBookSlot_UserNotFound() {
        when(bookingRepository.findUserOverlappingBookings(1L, start, end)).thenReturn(List.of());
        when(bookingRepository.findOverlappingBookings(start, end)).thenReturn(List.of());
        when(slotRepository.findByStatus("AVAILABLE")).thenReturn(List.of(slot));
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseData response = bookingService.bookSlot(1L, "CAR", "ABC123", start, end);

        assertEquals("ERROR", response.getStatus());
        assertTrue(response.getMessage().contains("User not found"));
    }

    @Test
    public void testBookSlot_VehicleNotFound() {
        when(bookingRepository.findUserOverlappingBookings(1L, start, end)).thenReturn(List.of());
        when(bookingRepository.findOverlappingBookings(start, end)).thenReturn(List.of());
        when(slotRepository.findByStatus("AVAILABLE")).thenReturn(List.of(slot));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(vehicleRepository.findByLicensePlate("ABC123")).thenReturn(Optional.empty());

        ResponseData response = bookingService.bookSlot(1L, "CAR", "ABC123", start, end);

        assertEquals("ERROR", response.getStatus());
        assertTrue(response.getMessage().contains("Vehicle not found"));
    }
}