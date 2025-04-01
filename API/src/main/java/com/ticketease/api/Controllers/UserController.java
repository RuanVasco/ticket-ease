package com.ticketease.api.Controllers;

import com.ticketease.api.DTO.UserRoleDepartmentDTO;
import com.ticketease.api.DTO.User.CompleteUserDTO;
import com.ticketease.api.DTO.User.UserDTO;
import com.ticketease.api.Entities.*;
import com.ticketease.api.Repositories.*;
import com.ticketease.api.Services.CustomUserDetailsService;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomUserDetailsService userService;

    @Autowired
    private CargoRepository cargoRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final UserRoleDepartmentRepository userRoleDepartmentRepository;

    public UserController(UserRoleDepartmentRepository userRoleDepartmentRepository) {
        this.userRoleDepartmentRepository = userRoleDepartmentRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/me/departments")
    public ResponseEntity<?> getDepartments() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Set<Department> departments = user.getRoleBindings().stream()
                .map(UserRoleDepartment::getDepartment)
                .collect(Collectors.toSet());

        List<Department> sortedDepartments = departments.stream()
                .sorted(Comparator.comparing(Department::getId))
                .toList();

        return ResponseEntity.ok(sortedDepartments);
    }

    @GetMapping("/pageable")
    public ResponseEntity<Page<User>> getAllPageable(Pageable pageable) {
        Page<User> users = userRepository.findAll(pageable);

        return ResponseEntity.ok(users);
    }

    @GetMapping("/{userID}")
    public CompleteUserDTO getUser(@PathVariable Long userID) {
        return userService.getUser(userID);
    }

    @Transactional
    @DeleteMapping("/{userID}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userID) {
        Optional<User> optionalUser = userRepository.findById(userID);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();

        user.getRoleBindings().clear();
        userRepository.save(user);

        userRoleDepartmentRepository.deleteByUser(user);
        userRoleDepartmentRepository.flush();

        userRepository.delete(user);

        return ResponseEntity.ok().build();
    }

    @Transactional
    @PutMapping("/{userID}")
    public ResponseEntity<?> updateUser(@PathVariable Long userID, @RequestBody UserDTO userUpdateDTO) {
        User sender = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!sender.hasPermission("EDIT_USER", null)) {
            return new ResponseEntity<>("Acesso negado. Você não tem permissão para editar usuários.", HttpStatus.FORBIDDEN);
        }

        Optional<User> optionalUser = userRepository.findById(userID);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();

        user.getRoleBindings().clear();

        userRoleDepartmentRepository.deleteByUser(user);
        userRoleDepartmentRepository.flush();

        if (userUpdateDTO.cargo() != null && userUpdateDTO.cargo().getId() != null) {
            cargoRepository.findById(userUpdateDTO.cargo().getId()).ifPresent(user::setCargo);
        }

        if (userUpdateDTO.password() != null && !userUpdateDTO.password().isBlank()) {
            user.setPassword(userUpdateDTO.password(), passwordEncoder);
        }

        user.setName(userUpdateDTO.name());
        user.setEmail(userUpdateDTO.email());
        user.setPhone(userUpdateDTO.phone());

        userRepository.save(user);

        for (UserRoleDepartmentDTO pair : userUpdateDTO.roleDepartments()) {
            Long roleId = pair.role().getId();
            Long departmentId = pair.department() != null ? pair.department().getId() : null;

            Optional<Role> optionalRole = roleRepository.findById(roleId);
            if (optionalRole.isEmpty()) continue;

            UserRoleDepartment binding = new UserRoleDepartment();
            binding.setUser(user);
            binding.setRole(optionalRole.get());

            if (departmentId != null) {
                departmentRepository.findById(departmentId).ifPresent(binding::setDepartment);
            } else {
                binding.setDepartment(null);
            }

            userRoleDepartmentRepository.save(binding);
        }

        return ResponseEntity.ok("User updated successfully");
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO signUpDto) {
        User sender = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!sender.hasPermission("CREATE_USER", null)){
            return new ResponseEntity<>("Acesso negado. Você não tem permissão para criar usuários.", HttpStatus.FORBIDDEN);
        }

        if (userRepository.existsByEmail(signUpDto.email())) {
            return new ResponseEntity<>("Email is already taken!", HttpStatus.BAD_REQUEST);
        }

        User user = new User();
        user.setName(signUpDto.name());
        user.setEmail(signUpDto.email());
        user.setPhone(signUpDto.phone());
        user.setPassword(signUpDto.password(), passwordEncoder);

        if (signUpDto.cargo() != null && signUpDto.cargo().getId() != null) {
            cargoRepository.findById(signUpDto.cargo().getId()).ifPresent(user::setCargo);
        }

        userRepository.save(user);

        for (UserRoleDepartmentDTO pair : signUpDto.roleDepartments()) {
            Optional<Role> optionalRole = roleRepository.findById(pair.role().getId());

            if (optionalRole.isEmpty()) continue;

            UserRoleDepartment binding = new UserRoleDepartment();
            binding.setUser(user);
            binding.setRole(optionalRole.get());

            if (pair.department() != null && pair.department().getId() != null) {
                departmentRepository.findById(pair.department().getId()).ifPresent(binding::setDepartment);
            } else {
                binding.setDepartment(null);
            }

            userRoleDepartmentRepository.save(binding);
        }

        return new ResponseEntity<>("User registered successfully", HttpStatus.OK);
    }

}
