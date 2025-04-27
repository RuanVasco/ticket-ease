package com.ticketease.api.Components;

import com.ticketease.api.Entities.*;
import com.ticketease.api.Repositories.*;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

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

	private final UserRoleDepartmentRepository userRoleDepartmentRepository;

	public DataInitializer(UserRoleDepartmentRepository userRoleDepartmentRepository) {
		this.userRoleDepartmentRepository = userRoleDepartmentRepository;
	}

	@Override
	@Transactional
	public void run(String... args) {
		if (userRepository.count() == 0) {
			// Roles
			Role roleAdmin = roleRepository.findByName("ADMIN").orElseGet(() -> roleRepository.save(new Role("ADMIN")));
			Role roleUser = roleRepository.findByName("USER").orElseGet(() -> roleRepository.save(new Role("USER")));

			// Unidade
			Unit matriz = unitRepository.findByName("Matriz").orElseGet(() -> {
				Unit u = new Unit();
				u.setName("Matriz");
				u.setAddress("Matriz");
				return unitRepository.save(u);
			});

			// Departamentos
			Department TI = departmentRepository.findByName("TI").orElseGet(() -> {
				Department d = new Department();
				d.setName("TI");
				d.setUnit(matriz);
				d.setReceivesRequests(true);
				return departmentRepository.save(d);
			});

			Department RH = departmentRepository.findByName("RH").orElseGet(() -> {
				Department d = new Department();
				d.setName("RH");
				d.setUnit(matriz);
				d.setReceivesRequests(true);
				return departmentRepository.save(d);
			});

			// Permissões
			List<Permission> allPermissions = new ArrayList<>();

			Permission permissionCreateCargo = new Permission();
			permissionCreateCargo.setName("CREATE_CARGO");
			permissionCreateCargo.setDescription("Permite criar cargos");
			allPermissions.add(permissionCreateCargo);

			Permission permissionEditCargo = new Permission();
			permissionEditCargo.setName("EDIT_CARGO");
			permissionEditCargo.setDescription("Permite editar cargos");
			allPermissions.add(permissionEditCargo);

			Permission permissionDeleteCargo = new Permission();
			permissionDeleteCargo.setName("DELETE_CARGO");
			permissionDeleteCargo.setDescription("Permite deletar cargos");
			allPermissions.add(permissionDeleteCargo);

			Permission permissionCreateDepartment = new Permission();
			permissionCreateDepartment.setName("CREATE_DEPARTMENT");
			permissionCreateDepartment.setDescription("Permite criar departamentos");
			allPermissions.add(permissionCreateDepartment);

			Permission permissionDeleteDepartment = new Permission();
			permissionDeleteDepartment.setName("DELETE_DEPARTMENT");
			permissionDeleteDepartment.setDescription("Permite deletar departamentos");
			allPermissions.add(permissionDeleteDepartment);

			Permission permissionEditDepartment = new Permission();
			permissionEditDepartment.setName("EDIT_DEPARTMENT");
			permissionEditDepartment.setDescription("Permite editar departamentos");
			allPermissions.add(permissionEditDepartment);

			Permission permissionCreateMessage = new Permission();
			permissionCreateMessage.setName("CREATE_MESSAGE");
			permissionCreateMessage.setDescription("Permite enviar mensagens");
			allPermissions.add(permissionCreateMessage);

			Permission permissionCreateTicket = new Permission();
			permissionCreateTicket.setName("CREATE_TICKET");
			permissionCreateTicket.setDescription("Permite criar chamados");
			allPermissions.add(permissionCreateTicket);

			Permission permissionManageTicket = new Permission();
			permissionManageTicket.setName("MANAGE_TICKET");
			permissionManageTicket.setDescription("Permite gerenciar chamados");
			allPermissions.add(permissionManageTicket);

			Permission permissionApproveTicket = new Permission();
			permissionApproveTicket.setName("APPROVE_TICKET");
			permissionApproveTicket.setDescription("Permite aceitar tickets que precisam de aprovação");
			allPermissions.add(permissionApproveTicket);

			Permission permissionManageTicketCategory = new Permission();
			permissionManageTicketCategory.setName("MANAGE_TICKET_CATEGORY");
			permissionManageTicketCategory.setDescription("Permite gerenciar categorias de tickets");
			allPermissions.add(permissionManageTicketCategory);

			Permission permissionManageForms = new Permission();
			permissionManageForms.setName("MANAGE_FORM");
			permissionManageForms.setDescription("Permite gerenciar formulários");
			allPermissions.add(permissionManageForms);

			Permission permissionCreateUnit = new Permission();
			permissionCreateUnit.setName("CREATE_UNIT");
			permissionCreateUnit.setDescription("Permite criar unidades");
			allPermissions.add(permissionCreateUnit);

			Permission permissionDeleteUnit = new Permission();
			permissionDeleteUnit.setName("DELETE_UNIT");
			permissionDeleteUnit.setDescription("Permite deletar unidades");
			allPermissions.add(permissionDeleteUnit);

			Permission permissionEditUnit = new Permission();
			permissionEditUnit.setName("EDIT_UNIT");
			permissionEditUnit.setDescription("Permite editar unidades");
			allPermissions.add(permissionEditUnit);

			Permission permissionCreateUser = new Permission();
			permissionCreateUser.setName("CREATE_USER");
			permissionCreateUser.setDescription("Permite criar usuários");
			allPermissions.add(permissionCreateUser);

			Permission permissionEditUser = new Permission();
			permissionEditUser.setName("EDIT_USER");
			permissionEditUser.setDescription("Permite editar usuários");
			allPermissions.add(permissionEditUser);

			Permission permissionDeleteUser = new Permission();
			permissionDeleteUser.setName("DELETE_USER");
			permissionDeleteUser.setDescription("Permite deletar usuários");
			allPermissions.add(permissionDeleteUser);

			Permission permissionCreateProfile = new Permission();
			permissionCreateProfile.setName("CREATE_PROFILE");
			permissionCreateProfile.setDescription("Permite criar perfis");
			allPermissions.add(permissionCreateProfile);

			Permission permissionEditProfile = new Permission();
			permissionEditProfile.setName("EDIT_PROFILE");
			permissionEditProfile.setDescription("Permite editar perfis");
			allPermissions.add(permissionEditProfile);

			Permission permissionDeleteProfile = new Permission();
			permissionDeleteProfile.setName("DELETE_PROFILE");
			permissionDeleteProfile.setDescription("Permite deletar perfis");
			allPermissions.add(permissionDeleteProfile);

			// Salvar permissões evitando duplicação
			List<Permission> savedPermissions = new ArrayList<>();
			for (Permission p : allPermissions) {
				permissionRepository.findByName(p.getName()).ifPresentOrElse(savedPermissions::add,
						() -> savedPermissions.add(permissionRepository.save(p)));
			}

			// Permissões por perfil
			roleAdmin.setPermissions(new HashSet<>(savedPermissions));

			Set<Permission> userPermissions = new HashSet<>();
			userPermissions.add(findByName(savedPermissions, "CREATE_MESSAGE"));
			userPermissions.add(findByName(savedPermissions, "CREATE_TICKET"));
			roleUser.setPermissions(userPermissions);

			// Categoria de ticket (sempre cria, sem verificar)
			TicketCategory ticketCategory = new TicketCategory();
			ticketCategory.setName("Infraestrutura");
			ticketCategory.setDepartment(TI);
			ticketCategoryRepository.save(ticketCategory);

			// Usuário admin
			User admin = new User();
			admin.setPassword("admin", passwordEncoder);
			admin.setName("Administrador");
			admin.setEmail("admin@admin");
			userRepository.save(admin);
			userRoleDepartmentRepository.save(new UserRoleDepartment(admin, roleAdmin, null));
			System.out.println("Usuário admin criado.");

			// Usuário comum
			User commonUser = new User();
			commonUser.setPassword("user", passwordEncoder);
			commonUser.setName("Usuário Comum");
			commonUser.setEmail("user@user");
			userRepository.save(commonUser);
			userRoleDepartmentRepository.save(new UserRoleDepartment(commonUser, roleUser, null));
			System.out.println("Usuário comum criado.");
		}
	}

	private Permission findByName(List<Permission> list, String name) {
		return list.stream().filter(p -> p.getName().equals(name)).findFirst()
				.orElseThrow(() -> new RuntimeException("Permissão não encontrada: " + name));
	}
}
