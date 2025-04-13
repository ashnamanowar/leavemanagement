package com.example.leavemanagement.service;

import com.example.leavemanagement.entity.Employee;
import com.example.leavemanagement.entity.LeaveRequest;
import com.example.leavemanagement.entity.Role;
import com.example.leavemanagement.repository.EmployeeRepository;
import com.example.leavemanagement.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    public Employee getRandomManager() {
        List<Employee> managers = employeeRepository.findByRole(Role.MANAGER);
        if (managers.isEmpty()) {
            throw new RuntimeException("No managers available in the system");
        }
        Random random = new Random();
        return managers.get(random.nextInt(managers.size()));
    }

    public LeaveRequest createLeaveRequest(Long employeeId, String reason) {
        Employee employee = getEmployeeById(employeeId);
        
        // If employee doesn't have a manager, assign a random one
        if (employee.getSupervisor() == null) {
            Employee randomManager = getRandomManager();
            employee.setSupervisor(randomManager);
            employeeRepository.save(employee);
        }
        
        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setEmployee(employee);
        leaveRequest.setReason(reason);
        leaveRequest.setRequestDate(LocalDateTime.now());
        leaveRequest.setStatus("PENDING");
        
        return leaveRequestRepository.save(leaveRequest);
    }

    public List<LeaveRequest> getPendingRequests() {
        return leaveRequestRepository.findByStatus("PENDING");
    }

    public LeaveRequest updateLeaveStatus(Long requestId, String status) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Leave request not found"));
        
        leaveRequest.setStatus(status);
        return leaveRequestRepository.save(leaveRequest);
    }

    public List<LeaveRequest> getEmployeeRequests(Long employeeId) {
        return leaveRequestRepository.findByEmployeeId(employeeId);
    }
} 