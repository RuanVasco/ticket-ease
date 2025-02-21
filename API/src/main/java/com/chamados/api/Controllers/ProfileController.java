package com.chamados.api.Controllers;

import com.chamados.api.Entities.Cargo;
import com.chamados.api.Entities.Role;
import com.chamados.api.Repositories.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("profiles")
public class ProfileController {

    @Autowired
    private RoleRepository roleRepository;

    @GetMapping("/")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(roleRepository.findAll());
    }

    @GetMapping("/pageable")
    public ResponseEntity<Page<Role>> getAllPageable(Pageable pageable) {
        Page<Role> roles = roleRepository.findAll(pageable);

        return ResponseEntity.ok(roles);
    }

    @GetMapping("/{profileId}")
    public ResponseEntity<?> getProfile(@PathVariable Long profileId) {
        Optional<Role> optionalRole = roleRepository.findById(profileId);

        if (optionalRole.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Role profile = optionalRole.get();
        return ResponseEntity.ok(profile);
    }
}
