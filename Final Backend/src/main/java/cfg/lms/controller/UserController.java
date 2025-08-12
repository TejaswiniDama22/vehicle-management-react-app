package cfg.lms.controller;

import cfg.lms.dto.LoginRequest;
import cfg.lms.entity.User;
import cfg.lms.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ResponseData> register(@Valid @RequestBody User user) {
        ResponseData response = userService.register(user);
        return ResponseEntity.ok(response);
    }
    @CrossOrigin(origins = "http://localhost:4200")
    @PostMapping("/login")
    public ResponseEntity<ResponseData> login(@RequestBody LoginRequest loginRequest) {
        ResponseData response = userService.login(
            loginRequest.getEmail(), loginRequest.getPassword()
        );
        return ResponseEntity.ok(response);
    }
    @GetMapping("/me/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Long userId) {
        Optional<User> user = userService.getUserById(userId);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get()); // includes userId, name, email
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    
    }
}