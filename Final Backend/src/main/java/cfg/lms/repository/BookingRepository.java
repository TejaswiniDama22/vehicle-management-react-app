package cfg.lms.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import cfg.lms.entity.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Get all bookings made by a specific user
    List<Booking> findByUserUserId(Long userId);

    // Check if a booking ID already exists
    boolean existsByBookingId(Long bookingId);

    // Find bookings within a time range (used for daily slot availability)
    List<Booking> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);

    // Find overlapping bookings (any booking that clashes with a given time window)
    @Query("SELECT b FROM Booking b WHERE " +
           "(b.startTime < :end AND b.endTime > :start)")
    List<Booking> findOverlappingBookings(LocalDateTime start, LocalDateTime end);

    // Find overlapping bookings for a specific user
    @Query("SELECT b FROM Booking b WHERE " +
           "b.user.userId = :userId AND " +
           "(b.startTime < :end AND b.endTime > :start)")
    List<Booking> findUserOverlappingBookings(Long userId, LocalDateTime start, LocalDateTime end);
}
