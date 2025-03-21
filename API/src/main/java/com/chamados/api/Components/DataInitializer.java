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

            Permission permissionFullAccess = new Permission();
            permissionFullAccess.setName("FULL_ACCESS");
            permissionFullAccess.setDescription("Acesso total ao sistema");

            Permission permissionCreateCargo = new Permission();
            permissionCreateCargo.setName("CREATE_CARGO");
            permissionCreateCargo.setDescription("Permite criar cargos");

            Permission permissionEditCargo = new Permission();
            permissionEditCargo.setName("EDIT_CARGO");
            permissionEditCargo.setDescription("Permite editar cargos");

            Permission permissionDeleteCargo = new Permission();
            permissionDeleteCargo.setName("DELETE_CARGO");
            permissionDeleteCargo.setDescription("Permite deletar cargos");

            Permission permissionCreateDepartment = new Permission();
            permissionCreateDepartment.setName("CREATE_DEPARTMENT");
            permissionCreateDepartment.setDescription("Permite criar departamentos");

            Permission permissionDeleteDepartment = new Permission();
            permissionDeleteDepartment.setName("DELETE_DEPARTMENT");
            permissionDeleteDepartment.setDescription("Permite deletar departamentos");

            Permission permissionUpdateDepartment = new Permission();
            permissionUpdateDepartment.setName("EDIT_DEPARTMENT");
            permissionUpdateDepartment.setDescription("Permite editar departamentos");

            Permission permissionCreateMessage = new Permission();
            permissionCreateMessage.setName("CREATE_MESSAGE");
            permissionCreateMessage.setDescription("Permite enviar mensagens");

            Permission permissionCreateTicket = new Permission();
            permissionCreateTicket.setName("CREATE_TICKET");
            permissionCreateTicket.setDescription("Permite criar chamados");

            Permission permissionManageTicket = new Permission();
            permissionManageTicket.setName("MANAGE_TICKET");
            permissionManageTicket.setDescription("Permite gerenciar chamados");

            Permission permissionCreateTicketCategory = new Permission();
            permissionCreateTicketCategory.setName("CREATE_TICKET_CATEGORY");
            permissionCreateTicketCategory.setDescription("Permite criar categorias de chamado");

            Permission permissionUpdateTicketCategory = new Permission();
            permissionUpdateTicketCategory.setName("EDIT_TICKET_CATEGORY");
            permissionUpdateTicketCategory.setDescription("Permite editar categorias de chamado");

            Permission permissionDeleteTicketCategory = new Permission();
            permissionDeleteTicketCategory.setName("DELETE_TICKET_CATEGORY");
            permissionDeleteTicketCategory.setDescription("Permite deletar categorias de chamado");

            Permission permissionCreateUnit = new Permission();
            permissionCreateUnit.setName("CREATE_UNIT");
            permissionCreateUnit.setDescription("Permite criar unidades");

            Permission permissionDeleteUnit = new Permission();
            permissionDeleteUnit.setName("DELETE_UNIT");
            permissionDeleteUnit.setDescription("Permite deletar unidades");

            Permission permissionUpdateUnit = new Permission();
            permissionUpdateUnit.setName("EDIT_UNIT");
            permissionUpdateUnit.setDescription("Permite editar unidades");

            Permission permissionCreateUser = new Permission();
            permissionCreateUser.setName("CREATE_USER");
            permissionCreateUser.setDescription("Permite criar usuários");

            Permission permissionUpdateUser = new Permission();
            permissionUpdateUser.setName("EDIT_USER");
            permissionUpdateUser.setDescription("Permite editar usuários");

            Permission permissionDeleteUser = new Permission();
            permissionDeleteUser.setName("DELETE_USER");
            permissionDeleteUser.setDescription("Permite deletar usuários");

            Permission permissionCreateProfile = new Permission();
            permissionCreateProfile.setName("CREATE_PROFILE");
            permissionCreateProfile.setDescription("Permite criar perfis");

            Permission permissionEditProfile = new Permission();
            permissionEditProfile.setName("EDIT_PROFILE");
            permissionEditProfile.setDescription("Permite editar perfis");

            Permission permissionDeleteProfile = new Permission();
            permissionDeleteProfile.setName("DELETE_PROFILE");
            permissionDeleteProfile.setDescription("Permite deletar perfis");

            permissionFullAccess = permissionRepository.save(permissionFullAccess);

            permissionRepository.save(permissionCreateCargo);
            permissionRepository.save(permissionEditCargo);
            permissionRepository.save(permissionDeleteCargo);

            permissionRepository.save(permissionCreateDepartment);
            permissionRepository.save(permissionDeleteDepartment);
            permissionRepository.save(permissionUpdateDepartment);

            permissionCreateMessage = permissionRepository.save(permissionCreateMessage);

            permissionCreateTicket = permissionRepository.save(permissionCreateTicket);
            permissionRepository.save(permissionManageTicket);

            permissionRepository.save(permissionCreateTicketCategory);
            permissionRepository.save(permissionDeleteTicketCategory);
            permissionRepository.save(permissionUpdateTicketCategory);

            permissionRepository.save(permissionCreateUnit);
            permissionRepository.save(permissionDeleteUnit);
            permissionRepository.save(permissionUpdateUnit);

            permissionRepository.save(permissionCreateUser);
            permissionRepository.save(permissionUpdateUser);
            permissionRepository.save(permissionDeleteUser);

            permissionRepository.save(permissionCreateProfile);
            permissionRepository.save(permissionEditProfile);
            permissionRepository.save(permissionDeleteProfile);

            Set<Permission> permissions = new HashSet<>();
            permissions.add(permissionFullAccess);

            Set<Permission> permissionsUser = new HashSet<>();
            permissionsUser.add(permissionCreateMessage);
            permissionsUser.add(permissionCreateTicket);

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
            Set<Department> departmentsAdmin = new HashSet<>();
            departmentsAdmin.add(TI);
            departmentsAdmin.add(RH);
            admin.setDepartments(departmentsAdmin);

            userRepository.save(admin);
            System.out.println("Usuário admin criado.");

            User commonUser = new User();
            commonUser.setPassword("user", passwordEncoder);
            commonUser.setName("Usuário Comum");
            commonUser.setEmail("user@user");
            commonUser.setRoles(rolesUser);
            Set<Department> departmentsUser = new HashSet<>();
            departmentsUser.add(RH);
            commonUser.setDepartments(departmentsUser);

            userRepository.save(commonUser);
            System.out.println("Usuário comum criado.");
        }
    }
}
