package com.example.leavemanagement.service;

import com.example.leavemanagement.entity.*;
import com.example.leavemanagement.repository.*;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LeaveService {

    private final LeaveRequestRepository leaveRepo;
    private final EmployeeRepository employeeRepo;

    public LeaveService(LeaveRequestRepository leaveRepo, EmployeeRepository employeeRepo) {
        this.leaveRepo = leaveRepo;
        this.employeeRepo = employeeRepo;
    }

    public String requestLeave(Long requesterId, String reason) {
        Employee employee = employeeRepo.findById(requesterId).orElseThrow();

        Employee manager = employee.getSupervisor();
        if (manager == null) return "No Manager Assigned";

        LeaveRequest request = new LeaveRequest();
        request.setRequester(employee);
        request.setReason(reason);

        if (manager.isAvailable()) {
            request.setStatus("APPROVED");
        } else {
            Employee supervisor = manager.getSupervisor();
            if (supervisor != null && supervisor.isAvailable()) {
                request.setStatus("APPROVED");
            } else {
                request.setStatus("STUCK");
            }
        }

        leaveRepo.save(request);
        return request.getStatus();
    }

    public void toggleAvailability(Long id) {
        Employee e = employeeRepo.findById(id).orElseThrow();
        e.setAvailable(!e.isAvailable());
        employeeRepo.save(e);
    }

    public Employee addEmployee(Employee e) {
        return employeeRepo.save(e);
    }
}

