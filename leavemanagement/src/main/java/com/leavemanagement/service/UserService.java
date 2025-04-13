package com.leavemanagement.service;

import com.leavemanagement.entity.User;
import com.leavemanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> findByUserId(String userId) {
        return userRepository.findByUserId(userId);
    }

    public User updateAvailability(Long userId, boolean isAvailable) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setAvailable(isAvailable);
        return userRepository.save(user);
    }

    public Optional<User> findAvailableManager() {
        return userRepository.findByRoleAndIsAvailableTrue(com.leavemanagement.entity.Role.MANAGER);
    }

    public Optional<User> findAvailableSupervisor() {
        return userRepository.findByRoleAndIsAvailableTrue(com.leavemanagement.entity.Role.SUPERVISOR);
    }

    public boolean matchesPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
} 