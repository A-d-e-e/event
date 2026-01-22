package com.edutech.eventmanagementsystem.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.edutech.eventmanagementsystem.dto.LoginRequest;
import com.edutech.eventmanagementsystem.dto.LoginResponse;
import com.edutech.eventmanagementsystem.entity.User;
import com.edutech.eventmanagementsystem.jwt.JwtUtil;
import com.edutech.eventmanagementsystem.service.OtpService;
import com.edutech.eventmanagementsystem.service.UserService;

@RestController
public class RegisterAndLoginController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private OtpService otpService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/api/user/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User registeredUser = userService.registerUser(user);
        return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
    }

    @PostMapping("/api/user/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        } catch (AuthenticationException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password", e);
        }

        final UserDetails userDetails = userService.loadUserByUsername(loginRequest.getUsername());
        final String token = jwtUtil.generateToken(userDetails.getUsername());

        User user = userService.getUserByUsername(loginRequest.getUsername());

        return ResponseEntity
                .ok(new LoginResponse(token, user.getUsername(), user.getEmail(), user.getRole(), user.getUserID()));

    }

    // Get users by role (for stats)
    @GetMapping("/api/users/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
        List<User> users = userService.getUsersByRole(role);
        return ResponseEntity.ok(users);
    }

    // Get all users
    @GetMapping("/api/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/api/user/reset-password-with-otp")
    public ResponseEntity<Map<String, String>> resetPasswordWithOtp(@RequestBody Map<String, String> request) {
        Map<String, String> response = new HashMap<>();

        try {
            String email = request.get("email");
            String resetToken = request.get("resetToken"); // ✅ Changed from OTP
            String newPassword = request.get("newPassword");

            System.out.println("=== Password Reset Request ===");
            System.out.println("Email: " + email);
            System.out.println("Reset Token: " + resetToken);

            // Validate input
            if (email == null || email.trim().isEmpty()) {
                response.put("message", "Email is required");
                return ResponseEntity.badRequest().body(response);
            }

            if (resetToken == null || resetToken.trim().isEmpty()) {
                response.put("message", "Reset token is required");
                return ResponseEntity.badRequest().body(response);
            }

            if (newPassword == null || newPassword.trim().isEmpty()) {
                response.put("message", "New password is required");
                return ResponseEntity.badRequest().body(response);
            }

            // ✅ Validate reset token (instead of OTP)
            boolean isTokenValid = OtpController.validateResetToken(email, resetToken);

            if (!isTokenValid) {
                response.put("message", "Invalid or expired reset session. Please start again.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // Find user by email
            User user = userService.getUserByEmail(email);
            if (user == null) {
                System.out.println("User not found for email: " + email);
                response.put("message", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            System.out.println("User found: " + user.getUsername());

            // Update password with encoding
            String encodedPassword = passwordEncoder.encode(newPassword);
            user.setPassword(encodedPassword);
            userService.updateUser(user);

            System.out.println("✅ Password updated successfully for: " + email);

            response.put("message", "Password reset successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("Error in password reset: " + e.getMessage());
            e.printStackTrace();
            response.put("message", "Failed to reset password: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}