package com.ticketease.api.Controllers;

import com.ticketease.api.DTO.RoleDepartmentDTO;
import com.ticketease.api.DTO.User.CompleteUserDTO;
import com.ticketease.api.DTO.User.UserDTO;
import com.ticketease.api.Entities.*;
import com.ticketease.api.Repositories.*;
import com.ticketease.api.Services.CustomUserDetailsService;
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

    @GetMapping("/")
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

    @DeleteMapping("/{userID}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userID) {
        Optional<User> optionalUser = userRepository.findById(userID);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            user.getRoleBindings().clear();
            userRepository.save(user);

            userRepository.delete(user);
            return ResponseEntity.ok().build();
        }

        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{userID}")
    public ResponseEntity<?> updateUser(@PathVariable Long userID, @RequestBody UserDTO userUpdateDTO) {
        Optional<User> optionalUser = userRepository.findById(userID);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();

        if (userUpdateDTO.cargo() != null && userUpdateDTO.cargo().getId() != null) {
            Optional<Cargo> optionalCargo = cargoRepository.findById(userUpdateDTO.cargo().getId());
            if (optionalCargo.isPresent()) {
                Cargo cargo = optionalCargo.get();
                user.setCargo(cargo);
            }
        }

        if (userUpdateDTO.password() != "") {
            user.setPassword(userUpdateDTO.password(), passwordEncoder);
        }

        user.setName(userUpdateDTO.name());
        user.setEmail(userUpdateDTO.email());
        user.setPhone(userUpdateDTO.phone());

        userRepository.save(user);

        for (RoleDepartmentDTO pair : userUpdateDTO.roleDepartments()) {
            Optional<Role> optionalRole = roleRepository.findById(pair.role().getId());
            Optional<Department> optionalDept = departmentRepository.findById(pair.department().getId());

            if (optionalRole.isPresent() && optionalDept.isPresent()) {
                UserRoleDepartment binding = new UserRoleDepartment();
                binding.setUser(user);
                binding.setRole(optionalRole.get());
                binding.setDepartment(optionalDept.get());
                userRoleDepartmentRepository.save(binding);
            }
        }

        return ResponseEntity.ok("User updated successfully");
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO signUpDto) {
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

        for (RoleDepartmentDTO pair : signUpDto.roleDepartments()) {
            Optional<Role> optionalRole = roleRepository.findById(pair.role().getId());
            Optional<Department> optionalDept = departmentRepository.findById(pair.department().getId());

            if (optionalRole.isPresent() && optionalDept.isPresent()) {
                UserRoleDepartment binding = new UserRoleDepartment();
                binding.setUser(user);
                binding.setRole(optionalRole.get());
                binding.setDepartment(optionalDept.get());
                userRoleDepartmentRepository.save(binding);
            }
        }

        return new ResponseEntity<>("User registered successfully", HttpStatus.OK);
    }

}
