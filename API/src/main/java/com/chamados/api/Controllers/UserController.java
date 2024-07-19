package com.chamados.api.Controllers;

import com.chamados.api.DTO.UserDTO;
import com.chamados.api.DTO.UserUpdateDTO;
import com.chamados.api.Entities.Cargo;
import com.chamados.api.Entities.Department;
import com.chamados.api.Entities.Role;
import com.chamados.api.Entities.User;
import com.chamados.api.Repositories.CargoRepository;
import com.chamados.api.Repositories.DepartmentRepository;
import com.chamados.api.Repositories.RoleRepository;
import com.chamados.api.Services.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.chamados.api.Repositories.UserRepository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

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


    @GetMapping("/")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(userRepository.findAllWithoutPassword());
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

        Optional<Cargo> optionalCargo = cargoRepository.findById(userUpdateDTO.cargo_id());
        Optional<Department> optionalDepartment = departmentRepository.findById(userUpdateDTO.department_id());

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
        user.setCargo(cargo);
        user.setDepartment(department);

        userRepository.save(user);

        return ResponseEntity.ok("User updated successfully");
    }
}
