package com.ticketease.api.Services;

import com.ticketease.api.DTO.UserRoleDepartmentDTO;
import com.ticketease.api.DTO.User.CompleteUserDTO;
import com.ticketease.api.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ticketease.api.Entities.User;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public CompleteUserDTO getUser(Long userID) {
        User user = userRepository.findById(userID)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<UserRoleDepartmentDTO> roleDepartments = user.getRoleBindings().stream()
                .map(binding -> new UserRoleDepartmentDTO(
                        binding.getDepartment(),
                        binding.getRole()
                ))
                .toList();

        return new CompleteUserDTO(
                user.getId(),
                user.getName(),
                user.getPhone(),
                user.getEmail(),
                null,
                user.getCargo() != null ? user.getCargo() : null,
                roleDepartments
        );
    }
}
