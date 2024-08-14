package com.chamados.api.Services;

import com.chamados.api.DTO.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.chamados.api.Components.UserDetailsImpl;
import com.chamados.api.Entities.User;
import com.chamados.api.Repositories.UserRepository;

import java.util.Optional;


@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        return new UserDetailsImpl(user);
    }

    public UserDTO getUser(Long userID) {
        User user = userRepository.findById(userID)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getPhone(), user.getDepartment(), user.getCargo());
    }

}
