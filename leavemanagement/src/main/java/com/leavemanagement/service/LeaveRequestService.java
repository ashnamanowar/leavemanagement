package com.leavemanagement.service;

import com.leavemanagement.entity.LeaveRequest;
import com.leavemanagement.entity.LeaveStatus;
import com.leavemanagement.entity.User;
import com.leavemanagement.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LeaveRequestService {
    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private UserService userService;

    public LeaveRequest createLeaveRequest(LeaveRequest leaveRequest) {
        // Find available manager
        User manager = userService.findAvailableManager()
            .orElseThrow(() -> new RuntimeException("No available manager found"));
        leaveRequest.setManager(manager);
        return leaveRequestRepository.save(leaveRequest);
    }

    public List<LeaveRequest> getEmployeeLeaveRequests(User employee) {
        return leaveRequestRepository.findByEmployee(employee);
    }

    public List<LeaveRequest> getManagerLeaveRequests(User manager) {
        return leaveRequestRepository.findByManager(manager);
    }

    public List<LeaveRequest> getSupervisorLeaveRequests(User supervisor) {
        return leaveRequestRepository.findBySupervisor(supervisor);
    }

    public LeaveRequest processManagerDecision(Long requestId, User manager, boolean approve) {
        LeaveRequest request = leaveRequestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Leave request not found"));

        if (!request.getManager().getId().equals(manager.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        if (approve) {
            request.setStatus(LeaveStatus.APPROVED);
        } else {
            // If manager rejects, find available supervisor
            User supervisor = userService.findAvailableSupervisor()
                .orElseThrow(() -> new RuntimeException("No available supervisor found"));
            request.setSupervisor(supervisor);
        }

        return leaveRequestRepository.save(request);
    }

    public LeaveRequest processSupervisorDecision(Long requestId, User supervisor, boolean approve) {
        LeaveRequest request = leaveRequestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Leave request not found"));

        if (!request.getSupervisor().getId().equals(supervisor.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        request.setStatus(approve ? LeaveStatus.APPROVED : LeaveStatus.REJECTED);
        return leaveRequestRepository.save(request);
    }
} 