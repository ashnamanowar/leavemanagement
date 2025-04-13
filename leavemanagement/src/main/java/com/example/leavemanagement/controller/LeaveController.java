package com.example.leavemanagement.controller;

import com.example.leavemanagement.entity.Employee;
import com.example.leavemanagement.service.LeaveService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class LeaveController {

    private static final Logger logger = LoggerFactory.getLogger(LeaveController.class);
    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @PostMapping("/leave/request")
    public ResponseEntity<String> requestLeave(@RequestParam Long id, @RequestParam String reason) {
        try {
            logger.info("Requesting leave for employee ID: {}, reason: {}", id, reason);
            String result = leaveService.requestLeave(id, reason);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error processing leave request: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/toggle-availability/{id}")
    public ResponseEntity<String> toggleAvailability(@PathVariable Long id) {
        try {
            logger.info("Toggling availability for employee ID: {}", id);
            leaveService.toggleAvailability(id);
            return ResponseEntity.ok("Availability toggled successfully");
        } catch (Exception e) {
            logger.error("Error toggling availability: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/add-employee")
    public ResponseEntity<Employee> addEmployee(@RequestBody Employee employee) {
        try {
            logger.info("Adding new employee: {}", employee.getUsername());
            Employee savedEmployee = leaveService.addEmployee(employee);
            return ResponseEntity.ok(savedEmployee);
        } catch (Exception e) {
            logger.error("Error adding employee: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        try {
            logger.info("Test endpoint called");
            return ResponseEntity.ok("Backend is working!");
        } catch (Exception e) {
            logger.error("Error in test endpoint: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
