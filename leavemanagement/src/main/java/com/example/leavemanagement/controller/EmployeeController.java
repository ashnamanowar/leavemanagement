package com.example.leavemanagement.controller;

import com.example.leavemanagement.entity.Employee;
import com.example.leavemanagement.entity.LeaveRequest;
import com.example.leavemanagement.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @PostMapping("/request-leave")
    public ResponseEntity<Map<String, String>> requestLeave(
            @RequestBody Map<String, Object> requestBody) {
        Map<String, String> response = new HashMap<>();
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("Authentication: " + auth);
            if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
                response.put("message", "Authentication required");
                return ResponseEntity.status(403).body(response);
            }

            System.out.println("Request body: " + requestBody);
            
            Long employeeId = Long.parseLong(requestBody.get("employeeId").toString());
            String reason = requestBody.get("reason").toString();
            
            System.out.println("Processing leave request for employee ID: " + employeeId + " with reason: " + reason);

            Employee employee = employeeService.getEmployeeById(employeeId);
            if (employee == null) {
                response.put("message", "Employee not found");
                return ResponseEntity.status(404).body(response);
            }
            
            boolean wasManagerAssigned = employee.getSupervisor() == null;
            
            LeaveRequest leaveRequest = employeeService.createLeaveRequest(employeeId, reason);
            Employee manager = leaveRequest.getEmployee().getSupervisor();
            
            response.put("message", "Leave request submitted successfully");
            response.put("managerName", manager != null ? manager.getName() : "your manager");
            response.put("wasManagerAssigned", String.valueOf(wasManagerAssigned));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // Simplified endpoint for testing that doesn't require authentication
    @PostMapping("/simple-leave-request")
    public ResponseEntity<Map<String, String>> simpleLeaveRequest(
            @RequestBody Map<String, Object> requestBody) {
        Map<String, String> response = new HashMap<>();
        try {
            System.out.println("Request body for simple leave request: " + requestBody);
            
            Long employeeId = Long.parseLong(requestBody.get("employeeId").toString());
            String reason = requestBody.get("reason").toString();
            
            System.out.println("Processing simple leave request for employee ID: " + employeeId + " with reason: " + reason);
            
            // For testing, always return a successful response
            response.put("message", "Leave request submitted successfully");
            response.put("managerName", "Test Manager");
            response.put("wasManagerAssigned", "true");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/pending-leaves")
    public ResponseEntity<?> getPendingLeaves() {
        Map<String, String> response = new HashMap<>();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            response.put("message", "Authentication required");
            return ResponseEntity.status(403).body(response);
        }
        List<LeaveRequest> requests = employeeService.getPendingRequests();
        return ResponseEntity.ok(requests);
    }

    @PutMapping("/leave/{requestId}/status")
    public ResponseEntity<?> updateLeaveStatus(
            @PathVariable Long requestId,
            @RequestParam String status) {
        Map<String, String> response = new HashMap<>();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            response.put("message", "Authentication required");
            return ResponseEntity.status(403).body(response);
        }
        try {
            LeaveRequest leaveRequest = employeeService.updateLeaveStatus(requestId, status);
            return ResponseEntity.ok(leaveRequest);
        } catch (Exception e) {
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/employee/{employeeId}/leaves")
    public ResponseEntity<?> getEmployeeLeaves(@PathVariable Long employeeId) {
        Map<String, String> response = new HashMap<>();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            response.put("message", "Authentication required");
            return ResponseEntity.status(403).body(response);
        }
        try {
            List<LeaveRequest> requests = employeeService.getEmployeeRequests(employeeId);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
} 