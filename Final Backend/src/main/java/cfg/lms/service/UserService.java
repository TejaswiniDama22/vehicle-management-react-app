package cfg.lms.service;

import cfg.lms.controller.ResponseData;
import cfg.lms.dto.LoginRequest;
import cfg.lms.entity.User;
import cfg.lms.exception.UserAlreadyExistsException;
import cfg.lms.exception.InvalidCredentialsException;
import cfg.lms.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public ResponseData register(@Valid User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("User already registered with this email.");
        }

        long randomId;
        do {
            randomId = 1000 + (long)(Math.random() * 9000);
        } while (userRepository.existsById(randomId));

        user.setUserId(randomId);
        User savedUser = userRepository.save(user);

        return new ResponseData("SUCCESS",
                "User registered successfully with User ID: " + savedUser.getUserId(),
                savedUser);
    }
    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }
    public ResponseData login(String email, String password) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!user.getPassword().equals(password)) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        return new ResponseData("SUCCESS", "Login successful", user);
    }
}