package com.leavemanagement.controller;

import com.leavemanagement.entity.LeaveRequest;
import com.leavemanagement.entity.User;
import com.leavemanagement.service.LeaveRequestService;
import com.leavemanagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-requests")
public class LeaveRequestController {
    @Autowired
    private LeaveRequestService leaveRequestService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> createLeaveRequest(@RequestBody LeaveRequest leaveRequest) {
        return ResponseEntity.ok(leaveRequestService.createLeaveRequest(leaveRequest));
    }

    @GetMapping("/employee/{userId}")
    public ResponseEntity<?> getEmployeeLeaveRequests(@PathVariable String userId) {
        User employee = userService.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Employee not found"));
        return ResponseEntity.ok(leaveRequestService.getEmployeeLeaveRequests(employee));
    }

    @GetMapping("/manager/{userId}")
    public ResponseEntity<?> getManagerLeaveRequests(@PathVariable String userId) {
        User manager = userService.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Manager not found"));
        return ResponseEntity.ok(leaveRequestService.getManagerLeaveRequests(manager));
    }

    @GetMapping("/supervisor/{userId}")
    public ResponseEntity<?> getSupervisorLeaveRequests(@PathVariable String userId) {
        User supervisor = userService.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Supervisor not found"));
        return ResponseEntity.ok(leaveRequestService.getSupervisorLeaveRequests(supervisor));
    }

    @PostMapping("/{requestId}/manager-decision")
    public ResponseEntity<?> processManagerDecision(
            @PathVariable Long requestId,
            @RequestParam String userId,
            @RequestParam boolean approve) {
        User manager = userService.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Manager not found"));
        return ResponseEntity.ok(leaveRequestService.processManagerDecision(requestId, manager, approve));
    }

    @PostMapping("/{requestId}/supervisor-decision")
    public ResponseEntity<?> processSupervisorDecision(
            @PathVariable Long requestId,
            @RequestParam String userId,
            @RequestParam boolean approve) {
        User supervisor = userService.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Supervisor not found"));
        return ResponseEntity.ok(leaveRequestService.processSupervisorDecision(requestId, supervisor, approve));
    }
} 