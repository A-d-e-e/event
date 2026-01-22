// package com.edutech.eventmanagementsystem.controller;
 
// import java.util.Map;

// import org.springframework.beans.factory.annotation.Autowired;
 
// import org.springframework.http.ResponseEntity;
 
// import org.springframework.web.bind.annotation.*;
 
// import com.edutech.eventmanagementsystem.service.EmailService;

// import com.edutech.eventmanagementsystem.service.OtpService;
 


// @RestController
 
// @RequestMapping("/api/otp")
 
// @CrossOrigin(origins = "*")
 
// public class OtpController {

//     @Autowired
 
//     private OtpService otpService;

//     @Autowired
 
//     private EmailService emailService;

//     @PostMapping("/send")
 
//     public ResponseEntity<?> sendOtp(@RequestParam String email) {
 
//         String otp = otpService.generateOtp(email);
 
//         emailService.sendOtp(email, otp);
 
//         return ResponseEntity.ok(
 
//             Map.of("message","OTP Sent successfully")
 
//         );
 
//     }

//     @PostMapping("/verify")
 
//     public ResponseEntity<?> verifyOtp(
 
//             @RequestParam String email,
 
//             @RequestParam String otp) {

//         boolean isValid = otpService.validateOtp(email, otp);
 
//         return isValid
 
//                 ? ResponseEntity.ok(Map.of("message","OTP verified"))
 
//                 : ResponseEntity.badRequest().body(Map.of("message","invalid OTP or expired otp"));
 
//     }
 
// }

 package com.edutech.eventmanagementsystem.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.eventmanagementsystem.service.EmailService;
import com.edutech.eventmanagementsystem.service.OtpService;

@RestController
@RequestMapping("/api/otp")
@CrossOrigin(origins = "*")
public class OtpController {

    @Autowired
    private OtpService otpService;

    @Autowired
    private EmailService emailService;

    // Store reset tokens temporarily (email -> reset token)
    private static final Map<String, String> resetTokens = new ConcurrentHashMap<>();

    @PostMapping("/send")
    public ResponseEntity<?> sendOtp(@RequestParam String email) {
        String otp = otpService.generateOtp(email);
        emailService.sendOtp(email, otp);
        return ResponseEntity.ok(Map.of("message", "OTP Sent successfully"));
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        boolean isValid = otpService.validateOtp(email, otp);
        
        if (isValid) {
            //  Generate a reset token after successful OTP verification
            String resetToken = UUID.randomUUID().toString();
            resetTokens.put(email, resetToken);
            
            System.out.println("OTP verified. Reset token generated for: " + email);
            
            return ResponseEntity.ok(Map.of(
                "message", "OTP verified",
                "resetToken", resetToken  // Send this to frontend
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid OTP or expired OTP"));
        }
    }

    //  Method to validate reset token
    public static boolean validateResetToken(String email, String resetToken) {
        String storedToken = resetTokens.get(email);
        boolean isValid = storedToken != null && storedToken.equals(resetToken);
        
        if (isValid) {
            // Remove token after use (one-time use)
            resetTokens.remove(email);
            System.out.println("Reset token validated and consumed for: " + email);
        } else {
            System.out.println("Invalid reset token for: " + email);
        }
        
        return isValid;
    }
}
