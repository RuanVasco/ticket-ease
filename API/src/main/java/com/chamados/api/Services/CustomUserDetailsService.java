package com.chamados.api.Services;

import com.chamados.api.DTO.RoleDepartmentDTO;
import com.chamados.api.DTO.User.CompleteUserDTO;
import com.chamados.api.DTO.User.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.chamados.api.Entities.User;
import com.chamados.api.Repositories.UserRepository;

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

        List<RoleDepartmentDTO> roleDepartments = user.getRoleBindings().stream()
                .map(binding -> new RoleDepartmentDTO(
                        binding.getRole(),
                        binding.getDepartment()
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
