package com.chamados.api.Components;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.chamados.api.Entities.Department;
import com.chamados.api.Entities.Role;
import com.chamados.api.Entities.Unit;
import com.chamados.api.Repositories.DepartmentRepository;
import com.chamados.api.Repositories.RoleRepository;
import com.chamados.api.Repositories.UnitRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private UnitRepository unitRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Initialize roles
        if (roleRepository.findByName("ROLE_USER").isEmpty()) {
            roleRepository.save(new Role("ROLE_USER"));
        }
        
        if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
            roleRepository.save(new Role("ROLE_ADMIN"));
        }

        // Initialize units
        initializeUnits();

        // Initialize departments
        initializeDepartments();
    }

    private void initializeUnits() {
        if (unitRepository.count() == 0) {
            unitRepository.save(new Unit("Unit A", "Address A"));
            unitRepository.save(new Unit("Unit B", "Address B"));
            unitRepository.save(new Unit("Unit C", "Address C"));
        }
    }

    private void initializeDepartments() {
        Unit unitA = unitRepository.findByName("Unit A").orElseThrow(() -> new RuntimeException("Unit A not found"));
        Unit unitB = unitRepository.findByName("Unit B").orElseThrow(() -> new RuntimeException("Unit B not found"));
        Unit unitC = unitRepository.findByName("Unit C").orElseThrow(() -> new RuntimeException("Unit C not found"));

        if (departmentRepository.findAll().isEmpty()) {
            departmentRepository.save(new Department("IT", true, unitA));
            departmentRepository.save(new Department("HR", true, unitB));
            departmentRepository.save(new Department("Finance", true, unitC));
            departmentRepository.save(new Department("Legal", false, unitA));
            departmentRepository.save(new Department("Marketing", false, unitB));
        }
    }
}
