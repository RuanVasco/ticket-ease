package com.chamados.api.Controllers;

import com.chamados.api.DTO.RoleDepartmentDTO;
import com.chamados.api.DTO.UserDTO;
import com.chamados.api.Entities.*;
import com.chamados.api.Repositories.*;
import com.chamados.api.Services.CustomUserDetailsService;
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
    public UserDTO getUser(@PathVariable Long userID) {
        return userService.getUser(userID);
    }

    @DeleteMapping("/{userID}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userID) {
        Optional<User> optionalUser = userRepository.findById(userID);

        if (optionalUser.isPresent()) {
            userRepository.deleteById(userID);
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

        if (userUpdateDTO.cargoId() != null) {
            Optional<Cargo> optionalCargo = cargoRepository.findById(userUpdateDTO.cargoId());
            if (optionalCargo.isPresent()) {
                Cargo cargo = optionalCargo.get();
                user.setCargo(cargo);
            }
        }

        user.setName(userUpdateDTO.name());
        user.setEmail(userUpdateDTO.email());
        user.setPhone(userUpdateDTO.phone());

        userRepository.save(user);

        for (RoleDepartmentDTO pair : userUpdateDTO.roleDepartments()) {
            Optional<Role> optionalRole = roleRepository.findById(pair.roleId());
            Optional<Department> optionalDept = departmentRepository.findById(pair.departmentId());

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

        if (signUpDto.cargoId() != null) {
            cargoRepository.findById(signUpDto.cargoId()).ifPresent(user::setCargo);
        }

        userRepository.save(user);

        for (RoleDepartmentDTO pair : signUpDto.roleDepartments()) {
            Optional<Role> optionalRole = roleRepository.findById(pair.roleId());
            Optional<Department> optionalDept = departmentRepository.findById(pair.departmentId());

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
