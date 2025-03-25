package com.chamados.api.Components;

import com.chamados.api.Entities.*;
import com.chamados.api.Repositories.*;
import com.chamados.api.Types.ScopeType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private PermissionRepository permissionRepository;
    @Autowired private UnitRepository unitRepository;
    @Autowired private DepartmentRepository departmentRepository;
    @Autowired private TicketCategoryRepository ticketCategoryRepository;

    private final UserRoleDepartmentRepository userRoleDepartmentRepository;

    public DataInitializer(UserRoleDepartmentRepository userRoleDepartmentRepository) {
        this.userRoleDepartmentRepository = userRoleDepartmentRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() == 0) {
            Role roleAdmin = roleRepository.findByName("ADMIN")
                    .orElseGet(() -> roleRepository.save(new Role("ADMIN")));

            Role roleUser = roleRepository.findByName("USER")
                    .orElseGet(() -> roleRepository.save(new Role("USER")));

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

            List<Permission> permissions = new ArrayList<>();

            permissions.add(createPermission("CREATE_CARGO", "Permite criar cargos"));
            permissions.add(createPermission("EDIT_CARGO", "Permite editar cargos"));
            permissions.add(createPermission("DELETE_CARGO", "Permite deletar cargos"));

            permissions.add(createPermission("CREATE_DEPARTMENT", "Permite criar departamentos"));
            permissions.add(createPermission("DELETE_DEPARTMENT", "Permite deletar departamentos"));
            permissions.add(createPermission("EDIT_DEPARTMENT", "Permite editar departamentos"));

            permissions.add(createPermission("CREATE_MESSAGE", "Permite enviar mensagens"));
            permissions.add(createPermission("CREATE_TICKET", "Permite criar chamados"));
            permissions.add(createPermission("MANAGE_TICKET", "Permite gerenciar chamados"));

            permissions.add(createPermission("VIEW_TICKET_CATEGORY", "Permite ver categorias de chamado"));
            permissions.add(createPermission("CREATE_TICKET_CATEGORY", "Permite criar categorias de chamado"));
            permissions.add(createPermission("EDIT_TICKET_CATEGORY", "Permite editar categorias de chamado"));
            permissions.add(createPermission("DELETE_TICKET_CATEGORY", "Permite deletar categorias de chamado"));

            permissions.add(createPermission("CREATE_UNIT", "Permite criar unidades"));
            permissions.add(createPermission("DELETE_UNIT", "Permite deletar unidades"));
            permissions.add(createPermission("EDIT_UNIT", "Permite editar unidades"));

            permissions.add(createPermission("CREATE_USER", "Permite criar usuários"));
            permissions.add(createPermission("EDIT_USER", "Permite editar usuários"));
            permissions.add(createPermission("DELETE_USER", "Permite deletar usuários"));

            permissions.add(createPermission("CREATE_PROFILE", "Permite criar perfis"));
            permissions.add(createPermission("EDIT_PROFILE", "Permite editar perfis"));
            permissions.add(createPermission("DELETE_PROFILE", "Permite deletar perfis"));

            List<String> ticketCategoryPermissions = List.of(
                    "CREATE_TICKET_CATEGORY",
                    "EDIT_TICKET_CATEGORY",
                    "DELETE_TICKET_CATEGORY",
                    "MANAGE_TICKET"
            );
            List<Permission> departmentScopedPermissions = new ArrayList<>();


            for (String permissionName : ticketCategoryPermissions) {
                Permission permission = new Permission();
                permission.setName(permissionName);
                permission.setScope(ScopeType.DEPARTMENT);
                permission.setDescription(String.format("Permissão %s no escopo de departamento", permissionName));

                departmentScopedPermissions.add(permission);
            }


            // Persistir todas as permissões globais
            permissionRepository.saveAll(permissions);
            permissionRepository.saveAll(departmentScopedPermissions);

            // Associar permissões aos papéis
            Set<Permission> adminPermissions = new HashSet<>(permissions);
            roleAdmin.setPermissions(adminPermissions);

            Set<Permission> userPermissions = new HashSet<>();
            userPermissions.add(getPermissionByName(permissions, "CREATE_MESSAGE"));
            userPermissions.add(getPermissionByName(permissions, "CREATE_TICKET"));
            roleUser.setPermissions(userPermissions);

            Set<Role> rolesAdmin = new HashSet<>();
            rolesAdmin.add(roleAdmin);

            Set<Role> rolesUser = new HashSet<>();
            rolesUser.add(roleUser);

            Role roleManager = roleRepository.findByName("MANAGER")
                    .orElseGet(() -> roleRepository.save(new Role("MANAGER")));

            Set<Permission> managerPermissions = departmentScopedPermissions.stream()
                    .filter(p -> List.of(
                            "CREATE_TICKET_CATEGORY",
                            "EDIT_TICKET_CATEGORY",
                            "DELETE_TICKET_CATEGORY",
                            "MANAGE_TICKET"
                    ).contains(p.getName()))
                    .collect(Collectors.toSet());

            roleManager.setPermissions(managerPermissions);

            // Categoria inicial
            TicketCategory ticketCategory = new TicketCategory();
            ticketCategory.setName("Infraestrutura");
            ticketCategory.setReceiveTickets(true);
            ticketCategory.setDepartment(TI);
            ticketCategory.setPath("TI");
            ticketCategoryRepository.save(ticketCategory);

            // Usuário admin
            User admin = new User();
            admin.setPassword("admin", passwordEncoder);
            admin.setName("Administrador");
            admin.setEmail("admin@admin");
            userRepository.save(admin);
            List<UserRoleDepartment> adminBindings = List.of(
                    new UserRoleDepartment(admin, roleAdmin, TI),
                    new UserRoleDepartment(admin, roleAdmin, RH)
            );
            userRoleDepartmentRepository.saveAll(adminBindings);
            System.out.println("Usuário admin criado.");

            // Usuário comum
            User commonUser = new User();
            commonUser.setPassword("user", passwordEncoder);
            commonUser.setName("Usuário Comum");
            commonUser.setEmail("user@user");
            userRepository.save(commonUser);
            List<UserRoleDepartment> userBindings = List.of(
                    new UserRoleDepartment(commonUser, roleUser, RH)
            );
            userRoleDepartmentRepository.saveAll(userBindings);
            System.out.println("Usuário comum criado.");
        }
    }

    private Permission createPermission(String name, String description) {
        Permission permission = new Permission();
        permission.setName(name);
        permission.setDescription(description);
        permission.setScope(ScopeType.GLOBAL);
        return permission;
    }

    private Permission getPermissionByName(List<Permission> list, String name) {
        return list.stream()
                .filter(p -> p.getName().equals(name))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Permissão não encontrada: " + name));
    }
}
