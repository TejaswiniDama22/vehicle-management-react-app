package cfg.lms.vms;

import cfg.lms.controller.ResponseData;
import cfg.lms.entity.User;
import cfg.lms.exception.UserAlreadyExistsException;
import cfg.lms.repository.UserRepository;
import cfg.lms.service.UserService;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    private final UserRepository userRepository = mock(UserRepository.class);
    private final UserService userService = new UserService(userRepository);

    @Test
    public void testRegisterNewUser_Success() {
        User user = new User();
        user.setEmail("test@example.com");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());
        when(userRepository.existsById(anyLong())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        ResponseData response = userService.register(user);

        assertEquals("SUCCESS", response.getStatus());
        assertTrue(((User) response.getData()).getUserId() >= 1000);
        verify(userRepository).save(any(User.class));
    }

    @Test
    public void testRegisterUserAlreadyExists_ThrowsException() {
        User user = new User();
        user.setEmail("existing@example.com");

        when(userRepository.findByEmail("existing@example.com")).thenReturn(Optional.of(user));

        assertThrows(UserAlreadyExistsException.class, () -> userService.register(user));
    }
}
