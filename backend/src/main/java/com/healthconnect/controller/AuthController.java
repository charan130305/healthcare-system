package com.healthconnect.controller;

import com.healthconnect.config.JwtTokenProvider;
import com.healthconnect.dto.JwtResponse;
import com.healthconnect.dto.LoginRequest;
import com.healthconnect.dto.SignupRequest;
import com.healthconnect.model.Role;
import com.healthconnect.model.User;
import com.healthconnect.repository.RoleRepository;
import com.healthconnect.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtTokenProvider.generateToken(authentication);

        User user = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow();
        String roleStr = user.getRole().getName();

        return ResponseEntity.ok(new JwtResponse(jwt,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                roleStr));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        // Create new user's account
        User user = User.builder()
                .username(signUpRequest.getUsername())
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .fullName(signUpRequest.getFullName())
                .phone(signUpRequest.getPhone())
                .address(signUpRequest.getAddress())
                .build();

        String roleStr = signUpRequest.getRole();
        if (roleStr == null) {
            roleStr = "ROLE_CITIZEN";
        } else {
            switch (roleStr.toUpperCase()) {
                case "ADMIN":
                    roleStr = "ROLE_ADMIN";
                    break;
                case "HEALTH_WORKER":
                case "WORKER":
                    roleStr = "ROLE_HEALTH_WORKER";
                    break;
                default:
                    roleStr = "ROLE_CITIZEN";
            }
        }

        Role userRole = roleRepository.findByName(roleStr)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        user.setRole(userRole);

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }
}
