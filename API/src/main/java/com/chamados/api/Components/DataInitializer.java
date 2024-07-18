package com.chamados.api.Components;

import com.chamados.api.Entities.*;
import com.chamados.api.Repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private UnitRepository unitRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (unitRepository.count() == 0) {
            unitRepository.save(new Unit("Unit A", "Address A"));
            unitRepository.save(new Unit("Unit B", "Address B"));
            unitRepository.save(new Unit("Unit C", "Address C"));
        }

        Unit unitA = unitRepository.findByName("Unit A").orElseThrow(() -> new RuntimeException("Unit A not found"));
        Unit unitB = unitRepository.findByName("Unit B").orElseThrow(() -> new RuntimeException("Unit B not found"));
        Unit unitC = unitRepository.findByName("Unit C").orElseThrow(() -> new RuntimeException("Unit C not found"));

        if (departmentRepository.findAll().isEmpty()) {
            departmentRepository.save(new Department("TI", true, unitA));
            departmentRepository.save(new Department("RH", true, unitB));
            departmentRepository.save(new Department("Financeiro", true, unitC));
            departmentRepository.save(new Department("Fiscal", false, unitA));
            departmentRepository.save(new Department("Marketing", false, unitB));
        }

        if (roleRepository.findByName("ROLE_USER").isEmpty()) {
            roleRepository.save(new Role("ROLE_USER"));
        }

        if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
            roleRepository.save(new Role("ROLE_ADMIN"));
        }

        if (userRepository.findByEmail("admin@admin") == null) {
            User user = new User();
            user.setName("Admin User");
            user.setEmail("admin@admin");
            user.setPassword(passwordEncoder.encode("1234"));
            user.setDepartment(departmentRepository.findByName("TI"));
            userRepository.save(user);
        }
    }
}
