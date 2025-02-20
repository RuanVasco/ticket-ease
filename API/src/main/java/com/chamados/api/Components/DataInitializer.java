package com.chamados.api.Components;

import com.chamados.api.Entities.*;
import com.chamados.api.Repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() == 0) {
            Role roleAdmin = roleRepository.findByName("ADMIN")
                    .orElseGet(() -> roleRepository.save(new Role("ADMIN")));

            Role roleSuperAdmin = roleRepository.findByName("SUPERADMIN")
                    .orElseGet(() -> roleRepository.save(new Role("SUPERADMIN")));

            Role roleUser = roleRepository.findByName("USER")
                    .orElseGet(() -> roleRepository.save(new Role("USER")));

            Set<Role> roles = new HashSet<>();
            roles.add(roleAdmin);
            roles.add(roleUser);
            roles.add(roleSuperAdmin);

            User user = new User();
            user.setPassword("admin", passwordEncoder);
            user.setName("Administrador");
            user.setEmail("admin@admin");
            user.setRoles(roles);

            userRepository.save(user);
            System.out.println("Usuário admin criado.");
        }
    }
}
