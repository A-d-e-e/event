package com.edutech.eventmanagementsystem.jwt;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.edutech.eventmanagementsystem.entity.User;
import com.edutech.eventmanagementsystem.repository.UserRepository;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;


public class JwtUtil {
    
private final UserRepository userRepository;

    @Autowired
    public JwtUtil(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Use a long random secret in production (env/config). This mirrors your other project style.
    private final String secret = "secretKey000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
    // Expiration in seconds (e.g., 24h)
    private final int expiration = 86400;

    /**
     * Generate token for a given username.
     * Adds 'sub' and 'role' claims (role pulled from User).
     * You can extend with 'email' if desired.
     */
    public String generateToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration * 1000L);

        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found: " + username);
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", username);
        claims.put("role", user.getRole());
        // Optionally include email
        if (user.getEmail() != null) {
            claims.put("email", user.getEmail());
        }

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    public Claims extractAllClaims(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(secret)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }

    public String extractUsername(String token) throws JwtException {
        Claims claims = Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
        // compatible with 'sub'
        return claims.getSubject();
    }

    public boolean isTokenExpired(String token) {
        Date expirationDate = Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
        return expirationDate.before(new Date());
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String username;
        try {
            username = extractUsername(token);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }


}