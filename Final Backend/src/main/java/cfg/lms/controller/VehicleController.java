package cfg.lms.controller;

import cfg.lms.dto.VehicleRequest;
import cfg.lms.entity.User;
import cfg.lms.entity.Vehicle;
import cfg.lms.repository.UserRepository;
import cfg.lms.repository.VehicleRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("api/vehicle")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<ResponseData> registerVehicle(@Valid @RequestBody VehicleRequest request) {
        ResponseData response = new ResponseData();

        try {
            User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

            Optional<Vehicle> existingVehicle = vehicleRepository
                .findByUserUserIdAndLicensePlate(request.getUserId(), request.getLicensePlate());

            if (existingVehicle.isPresent()) {
                response.setStatus("ERROR");
                response.setMessage("Vehicle already registered with Vehicle ID: " + existingVehicle.get().getVehicleId());
                response.setData(existingVehicle.get());
                return ResponseEntity.badRequest().body(response);
            }

            long vehicleId;
            do {
                vehicleId = 1000 + (long)(Math.random() * 9000);
            } while (vehicleId == request.getUserId() || vehicleRepository.existsByVehicleId(vehicleId));

            Vehicle vehicle = new Vehicle();
            vehicle.setVehicleId(vehicleId);
            vehicle.setUser(user);
            vehicle.setLicensePlate(request.getLicensePlate());
            vehicle.setType(request.getVehicleType());

            Vehicle savedVehicle = vehicleRepository.save(vehicle);

            response.setStatus("SUCCESS");
            response.setMessage("Vehicle registered successfully with Vehicle ID: " + savedVehicle.getVehicleId());
            response.setData(savedVehicle);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            response.setStatus("ERROR");
            response.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.setStatus("ERROR");
            response.setMessage("Vehicle registration failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
        
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getVehiclesByUserId(@PathVariable Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        List<Vehicle> vehicles = vehicleRepository.findByUserUserId(userId);
        return ResponseEntity.ok(vehicles);
    }
}