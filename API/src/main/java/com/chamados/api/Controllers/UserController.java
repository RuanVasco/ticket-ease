package com.chamados.api.Controllers;

import com.chamados.api.DTO.UserDTO;
import com.chamados.api.DTO.UserRegisterDTO;
import com.chamados.api.DTO.UserUpdateDTO;
import com.chamados.api.Entities.Cargo;
import com.chamados.api.Entities.Department;
import com.chamados.api.Entities.Role;
import com.chamados.api.Entities.User;
import com.chamados.api.Repositories.CargoRepository;
import com.chamados.api.Repositories.DepartmentRepository;
import com.chamados.api.Repositories.RoleRepository;
import com.chamados.api.Services.CustomUserDetailsService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.chamados.api.Repositories.UserRepository;

import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

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


    @GetMapping("/")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(userRepository.findAllWithoutPassword());
    }

    @GetMapping("/pageable")
    public ResponseEntity<Page<User>> getAllPageable(Pageable pageable) {
        Page<User> users = userRepository.findAll(pageable);
        users.forEach(user -> user.setPassword(null));

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
    public ResponseEntity<?> updateUser(@PathVariable Long userID, @RequestBody UserUpdateDTO userUpdateDTO) {
        Optional<User> optionalUser = userRepository.findById(userID);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();

        Optional<Cargo> optionalCargo = cargoRepository.findById(userUpdateDTO.cargoId());
        Optional<Department> optionalDepartment = departmentRepository.findById(userUpdateDTO.departmentId());

        if (optionalCargo.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (optionalDepartment.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Cargo cargo = optionalCargo.get();
        Department department = optionalDepartment.get();

        user.setName(userUpdateDTO.name());
        user.setEmail(userUpdateDTO.email());
        user.setPhone(userUpdateDTO.phone());
        user.setCargo(cargo);
        user.setDepartment(department);

        userRepository.save(user);

        return ResponseEntity.ok("User updated successfully");
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegisterDTO signUpDto){

        Long cargoId = signUpDto.cargoId();
        Long departmentId = signUpDto.departmentId();

        if (userRepository.existsByEmail(signUpDto.email())){
            return new ResponseEntity<>("Email is already taken!", HttpStatus.BAD_REQUEST);
        }

        Optional<Role> optionalRoleUser = roleRepository.findByName("ROLE_USER");

        User user = new User();
        user.setName(signUpDto.name());
        user.setEmail(signUpDto.email());
        user.setPhone(signUpDto.phone());

        if (optionalRoleUser.isPresent()) {
            Role role = optionalRoleUser.get();
            Set<Role> roles = new HashSet<>();
            roles.add(role);
            user.setRoles(roles);
        }

        user.setPassword(passwordEncoder.encode(signUpDto.password()));

        if (cargoId != null) {
            Optional<Cargo> cargo = cargoRepository.findById(cargoId);
            cargo.ifPresent(user::setCargo);
        }

        if (departmentId != null) {
            Optional<Department> department = departmentRepository.findById(departmentId);
            department.ifPresent(user::setDepartment);
        }

        Optional<Role> defaultRole = roleRepository.findByName("ROLE_USER");
        user.setRoles(Collections.singleton(defaultRole.get()));

        userRepository.save(user);

        return new ResponseEntity<>("User registered successfully", HttpStatus.OK);
    }
}
