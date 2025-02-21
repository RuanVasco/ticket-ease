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

    @Autowired
    private PermissionRepository permissionRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() == 0) {
            Role roleAdmin = roleRepository.findByName("ADMIN")
                    .orElseGet(() -> roleRepository.save(new Role("ADMIN")));

            Role roleUser = roleRepository.findByName("USER")
                    .orElseGet(() -> roleRepository.save(new Role("USER")));

            Permission permissionCreateTicket = new Permission();
            permissionCreateTicket.setName("CREATE_TICKET");

            Permission permissionViewTicket = new Permission();
            permissionViewTicket.setName("VIEW_TICKET");

            Permission permissionViewProfile = new Permission();
            permissionViewProfile.setName("VIEW_PROFILE");

            Permission permissionViewTicketCategory = new Permission();
            permissionViewTicketCategory.setName("VIEW_TICKET_CATEGORY");

            Permission permissionCreateTicketCategory = new Permission();
            permissionCreateTicketCategory.setName("CREATE_TICKET_CATEGORY");

            Permission permissionCreateUnit = new Permission();
            permissionCreateUnit.setName("CREATE_UNIT");

            Permission permissionViewUnit = new Permission();
            permissionViewUnit.setName("VIEW_UNIT");

            Permission permissionCreateDepartment = new Permission();
            permissionCreateDepartment.setName("CREATE_DEPARTMENT");

            Permission permissionViewDepartment = new Permission();
            permissionViewDepartment.setName("VIEW_DEPARTMENT");

            permissionCreateTicket = permissionRepository.save(permissionCreateTicket);
            permissionViewTicket = permissionRepository.save(permissionViewTicket);
            permissionViewProfile = permissionRepository.save(permissionViewProfile);
            permissionViewTicketCategory = permissionRepository.save(permissionViewTicketCategory);
            permissionCreateTicketCategory = permissionRepository.save(permissionCreateTicketCategory);
            permissionCreateUnit = permissionRepository.save(permissionCreateUnit);
            permissionViewUnit = permissionRepository.save(permissionViewUnit);
            permissionCreateDepartment = permissionRepository.save(permissionCreateDepartment);
            permissionViewDepartment = permissionRepository.save(permissionViewDepartment);

            Set<Permission> permissions = new HashSet<>();
            permissions.add(permissionCreateTicket);
            permissions.add(permissionViewTicket);
            permissions.add(permissionViewProfile);
            permissions.add(permissionViewTicketCategory);
            permissions.add(permissionCreateTicketCategory);
            permissions.add(permissionCreateUnit);
            permissions.add(permissionViewUnit);
            permissions.add(permissionCreateDepartment);
            permissions.add(permissionViewDepartment);
            roleAdmin.setPermissions(permissions);

            Set<Role> roles = new HashSet<>();
            roles.add(roleAdmin);
            roles.add(roleUser);

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
