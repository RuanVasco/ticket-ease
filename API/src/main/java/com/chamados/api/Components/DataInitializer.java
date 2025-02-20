package com.chamados.api.Components;

import com.chamados.api.Entities.Cargo;
import com.chamados.api.Entities.Department;
import com.chamados.api.Entities.Unit;
import com.chamados.api.Entities.User;
import com.chamados.api.Repositories.CargoRepository;
import com.chamados.api.Repositories.DepartmentRepository;
import com.chamados.api.Repositories.UnitRepository;
import com.chamados.api.Repositories.UserRepository;
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
    private DepartmentRepository departmentRepository;

    @Autowired
    private CargoRepository cargoRepository;

    @Autowired
    private UnitRepository unitRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        Unit unit = new Unit();
        unit.setName("Matriz");
        unit.setAddress("...");
        unitRepository.save(unit);

        Department department = new Department();
        department.setName("Admin");
        department.setUnit(unit);
        department.setReceivesRequests(false);
        departmentRepository.save(department);

        Cargo cargo = new Cargo();
        cargo.setName("Administrador");
        cargoRepository.save(cargo);

        if (userRepository.count() == 0) {
            User user = new User();
            user.setPassword("admin", passwordEncoder);
            user.setName("Admin");
            user.setEmail("admin@example.com");
            user.setCargo(cargo);
            user.setDepartment(department);
            user.setPhone("1234");
            userRepository.save(user);
            System.out.println("Usuário admin criado.");
        }
    }
}
