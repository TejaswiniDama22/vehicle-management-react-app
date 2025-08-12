package cfg.lms.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cfg.lms.entity.Vehicle;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    Optional<Vehicle> findByUserUserIdAndLicensePlate(Long userId, String licensePlate);

    boolean existsByVehicleId(Long vehicleId);

    Optional<Vehicle> findByLicensePlate(String licensePlate);

    // ✅ Add this missing method:
    List<Vehicle> findByUserUserId(Long userId);
}
