package cfg.lms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cfg.lms.entity.Booking;
import cfg.lms.entity.Payment;
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
	boolean existsByBooking(Booking booking);
	Optional<Payment> findByBooking(Booking booking);
	Optional<Payment> findTopByBookingUserUserIdOrderByPaymentIdDesc(Long userId);
}
