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

    @Autowired
    private UnitRepository unitRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private TicketCategoryRepository ticketCategoryRepository;

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

            Permission permissionDeleteTicket = new Permission();
            permissionDeleteTicket.setName("DELETE_TICKET");

            Permission permissionEditTicket = new Permission();
            permissionEditTicket.setName("EDIT_TICKET");

            Permission permissionCreateTicketCategory = new Permission();
            permissionCreateTicketCategory.setName("CREATE_TICKET_CATEGORY");

            Permission permissionViewTicketCategory = new Permission();
            permissionViewTicketCategory.setName("VIEW_TICKET_CATEGORY");

            Permission permissionDeleteTicketCategory = new Permission();
            permissionDeleteTicketCategory.setName("DELETE_TICKET_CATEGORY");

            Permission permissionCreateUnit = new Permission();
            permissionCreateUnit.setName("CREATE_UNIT");

            Permission permissionViewUnit = new Permission();
            permissionViewUnit.setName("VIEW_UNIT");

            Permission permissionDeleteUnit = new Permission();
            permissionDeleteUnit.setName("DELETE_UNIT");

            Permission permissionUpdateUnit = new Permission();
            permissionUpdateUnit.setName("UPDATE_UNIT");

            Permission permissionCreateDepartment = new Permission();
            permissionCreateDepartment.setName("CREATE_DEPARTMENT");

            Permission permissionViewDepartment = new Permission();
            permissionViewDepartment.setName("VIEW_DEPARTMENT");

            Permission permissionDeleteDepartment = new Permission();
            permissionDeleteDepartment.setName("DELETE_DEPARTMENT");

            Permission permissionCreateMessage = new Permission();
            permissionCreateMessage.setName("CREATE_MESSAGE");

            Permission permissionViewMessage = new Permission();
            permissionViewMessage.setName("VIEW_MESSAGE");

            Permission permissionCreateUser = new Permission();
            permissionCreateUser.setName("CREATE_USER");

            Permission permissionViewUser = new Permission();
            permissionViewUser.setName("VIEW_USER");

            Permission permissionUpdateUser = new Permission();
            permissionUpdateUser.setName("EDIT_USER");

            Permission permissionDeleteUser = new Permission();
            permissionDeleteUser.setName("DELETE_USER");

            Permission permissionCreateProfile = new Permission();
            permissionCreateProfile.setName("CREATE_PROFILE");

            Permission permissionViewProfile = new Permission();
            permissionViewProfile.setName("VIEW_PROFILE");

            Permission permissionUpdateProfile = new Permission();
            permissionUpdateProfile.setName("EDIT_PROFILE");

            Permission permissionDeleteProfile = new Permission();
            permissionDeleteProfile.setName("DELETE_PROFILE");

            permissionCreateUser = permissionRepository.save(permissionCreateUser);
            permissionViewUser = permissionRepository.save(permissionViewUser);
            permissionUpdateUser = permissionRepository.save(permissionUpdateUser);
            permissionDeleteUser = permissionRepository.save(permissionDeleteUser);
            permissionCreateTicket = permissionRepository.save(permissionCreateTicket);
            permissionViewTicket = permissionRepository.save(permissionViewTicket);
            permissionDeleteTicket = permissionRepository.save(permissionDeleteTicket);
            permissionEditTicket = permissionRepository.save(permissionEditTicket);
            permissionCreateProfile = permissionRepository.save(permissionCreateProfile);
            permissionViewProfile = permissionRepository.save(permissionViewProfile);
            permissionUpdateProfile = permissionRepository.save(permissionUpdateProfile);
            permissionDeleteProfile = permissionRepository.save(permissionDeleteProfile);
            permissionViewTicketCategory = permissionRepository.save(permissionViewTicketCategory);
            permissionCreateTicketCategory = permissionRepository.save(permissionCreateTicketCategory);
            permissionDeleteTicketCategory = permissionRepository.save(permissionDeleteTicketCategory);
            permissionCreateUnit = permissionRepository.save(permissionCreateUnit);
            permissionViewUnit = permissionRepository.save(permissionViewUnit);
            permissionCreateDepartment = permissionRepository.save(permissionCreateDepartment);
            permissionViewDepartment = permissionRepository.save(permissionViewDepartment);
            permissionDeleteDepartment = permissionRepository.save(permissionDeleteDepartment);
            permissionDeleteUnit = permissionRepository.save(permissionDeleteUnit);
            permissionUpdateUnit = permissionRepository.save(permissionUpdateUnit);
            permissionCreateMessage = permissionRepository.save(permissionCreateMessage);
            permissionViewMessage = permissionRepository.save(permissionViewMessage);

            Set<Permission> permissions = new HashSet<>();
            permissions.add(permissionCreateUser);
            permissions.add(permissionViewUser);
            permissions.add(permissionUpdateUser);
            permissions.add(permissionDeleteUser);
            permissions.add(permissionCreateMessage);
            permissions.add(permissionViewMessage);
            permissions.add(permissionCreateTicket);
            permissions.add(permissionViewTicket);
            permissions.add(permissionDeleteTicket);
            permissions.add(permissionEditTicket);
            permissions.add(permissionViewProfile);
            permissions.add(permissionViewTicketCategory);
            permissions.add(permissionCreateTicketCategory);
            permissions.add(permissionDeleteTicketCategory);
            permissions.add(permissionCreateUnit);
            permissions.add(permissionViewUnit);
            permissions.add(permissionCreateDepartment);
            permissions.add(permissionViewDepartment);
            permissions.add(permissionDeleteDepartment);
            permissions.add(permissionDeleteUnit);
            permissions.add(permissionUpdateUnit);
            permissions.add(permissionCreateProfile);
            permissions.add(permissionUpdateProfile);
            permissions.add(permissionDeleteProfile);

            Set<Permission> permissionsUser = new HashSet<>();
            permissionsUser.add(permissionCreateMessage);
            permissionsUser.add(permissionViewMessage);
            permissionsUser.add(permissionCreateTicket);
            permissionsUser.add(permissionViewTicket);
            permissionsUser.add(permissionViewTicketCategory);

            roleAdmin.setPermissions(permissions);
            roleUser.setPermissions(permissionsUser);

            Set<Role> rolesAdmin = new HashSet<>();
            rolesAdmin.add(roleAdmin);

            Set<Role> rolesUser = new HashSet<>();
            rolesUser.add(roleUser);

            Unit matriz = new Unit();
            matriz.setName("Matriz");
            matriz.setAddress("Matriz");
            unitRepository.save(matriz);

            Department TI = new Department();
            TI.setName("TI");
            TI.setUnit(matriz);
            TI.setReceivesRequests(true);
            departmentRepository.save(TI);

            Department RH = new Department();
            RH.setName("RH");
            RH.setUnit(matriz);
            RH.setReceivesRequests(true);
            departmentRepository.save(RH);

            TicketCategory ticketCategory = new TicketCategory();
            ticketCategory.setName("Infraestrutura");
            ticketCategory.setReceiveTickets(true);
            ticketCategory.setDepartment(TI);
            ticketCategory.setPath("TI");
            ticketCategoryRepository.save(ticketCategory);

            User admin = new User();
            admin.setPassword("admin", passwordEncoder);
            admin.setName("Administrador");
            admin.setEmail("admin@admin");
            admin.setRoles(rolesAdmin);
            admin.setDepartment(TI);

            userRepository.save(admin);
            System.out.println("Usuário admin criado.");

            User commonUser = new User();
            commonUser.setPassword("user", passwordEncoder);
            commonUser.setName("Usuário Comum");
            commonUser.setEmail("user@user");
            commonUser.setRoles(rolesUser);
            commonUser.setDepartment(RH);

            userRepository.save(commonUser);
            System.out.println("Usuário comum criado.");
        }
    }
}
