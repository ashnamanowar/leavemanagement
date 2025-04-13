package com.example.leavemanagement.repository;

import com.example.leavemanagement.entity.Employee;
import com.example.leavemanagement.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByUsername(String username);
    List<Employee> findByRole(Role role);
}

