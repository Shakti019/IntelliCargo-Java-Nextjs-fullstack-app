package com.intellicargo.core.Controller;

import com.intellicargo.core.DTO.AuthResponse;
import com.intellicargo.core.DTO.LoginRequest;
import com.intellicargo.core.DTO.RegisterRequest;
import com.intellicargo.core.Model.UserModel;
import com.intellicargo.core.Service.AuthService;
import com.intellicargo.core.Security.JwtService;
import com.intellicargo.core.Repository.UserRepository;
import com.intellicargo.core.Repository.UserCompanyRoleRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final UserCompanyRoleRepository userCompanyRoleRepository;

    public AuthController(AuthService authService, 
                          AuthenticationManager authenticationManager, 
                          JwtService jwtService,
                          UserRepository userRepository,
                          UserCompanyRoleRepository userCompanyRoleRepository) {
        this.authService = authService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.userCompanyRoleRepository = userCompanyRoleRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        UserModel user = authService.registerUser(request);
        
        String primaryRole = userCompanyRoleRepository.findByUserAndIsPrimaryTrue(user)
                .map(ucr -> ucr.getRole().getName())
                .orElse("Guest");

        var userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPasswordHash())
                .authorities(new ArrayList<>()) 
                .build();
                
        String token = jwtService.generateToken(userDetails);
        
        return ResponseEntity.ok(new AuthResponse(token, user.getEmail(), primaryRole, user.getFullName()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        var user = userRepository.findByEmailIgnoreCase(request.getEmail()).orElseThrow();
        
        String primaryRole = userCompanyRoleRepository.findByUserAndIsPrimaryTrue(user)
                .map(ucr -> ucr.getRole().getName())
                .orElse("Guest");

        var userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPasswordHash())
                .authorities(new ArrayList<>()) 
                .build();
        
        String token = jwtService.generateToken(userDetails);
        
        return ResponseEntity.ok(new AuthResponse(token, user.getEmail(), primaryRole, user.getFullName()));
    }
}
