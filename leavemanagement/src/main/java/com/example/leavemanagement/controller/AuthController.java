package com.example.leavemanagement.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, 
    allowedHeaders = "*", 
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
    allowCredentials = "true")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");
        
        // Log login attempt
        System.out.println("Login attempt: username=" + username + ", password=" + password);
        
        // SIMPLIFIED: Accept any credentials for testing
        // if ("employee1".equals(username) && "password".equals(password)) {
        if (username != null && password != null) {
            Map<String, Object> response = new HashMap<>();
            Map<String, Object> user = new HashMap<>();
            user.put("id", 1);
            user.put("name", username);
            user.put("employeeId", 1);
            user.put("role", "EMPLOYEE");
            
            response.put("token", "mock-jwt-token");
            response.put("user", user);
            
            System.out.println("Login successful for user: " + username);
            return ResponseEntity.ok(response);
        }
        
        System.out.println("Login failed for user: " + username);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
    }
    
    @RequestMapping(method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleOptions() {
        System.out.println("Handling OPTIONS request to /api/auth");
        return ResponseEntity.ok().build();
    }
} 