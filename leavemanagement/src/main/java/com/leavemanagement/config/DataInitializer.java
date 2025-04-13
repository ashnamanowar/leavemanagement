package com.leavemanagement.config;

import com.leavemanagement.entity.User;
import com.leavemanagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserService userService;

    @Override
    public void run(String... args) throws Exception {
        // Create test employee
        User employee = new User();
        employee.setUserId("employee1");
        employee.setPassword("password123");
        employee.setName("Test Employee");
        employee.setRole(com.leavemanagement.entity.Role.EMPLOYEE);
        userService.createUser(employee);

        // Create test manager
        User manager = new User();
        manager.setUserId("manager1");
        manager.setPassword("password123");
        manager.setName("Test Manager");
        manager.setRole(com.leavemanagement.entity.Role.MANAGER);
        userService.createUser(manager);

        // Create test supervisor
        User supervisor = new User();
        supervisor.setUserId("supervisor1");
        supervisor.setPassword("password123");
        supervisor.setName("Test Supervisor");
        supervisor.setRole(com.leavemanagement.entity.Role.SUPERVISOR);
        userService.createUser(supervisor);
    }
} 