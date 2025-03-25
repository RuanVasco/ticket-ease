package com.chamados.api.Services;

import com.chamados.api.DTO.RoleDepartmentDTO;
import com.chamados.api.DTO.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.chamados.api.Entities.User;
import com.chamados.api.Repositories.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return user;
    }

    public UserDTO getUser(Long userID) {
        User user = userRepository.findById(userID)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<RoleDepartmentDTO> roleDepartments = user.getRoleBindings().stream()
                .map(binding -> new RoleDepartmentDTO(
                        binding.getRole().getId(),
                        binding.getDepartment().getId()
                ))
                .toList();

        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                null,
                user.getCargo() != null ? user.getCargo().getId() : null,
                roleDepartments
        );
    }
}
