package com.chamados.api.Controllers;

import com.chamados.api.DTO.RoleDTO;
import com.chamados.api.Entities.Permission;
import com.chamados.api.Entities.Role;
import com.chamados.api.Repositories.PermissionRepository;
import com.chamados.api.Repositories.RoleRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

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

    @DeleteMapping("/{profileId}")
    public ResponseEntity<?> deleteProfile(@PathVariable Long profileId) {
        Optional<Role> optionalRole = roleRepository.findById(profileId);

        if (optionalRole.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Role profile = optionalRole.get();
        roleRepository.deleteById(profile.getId());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{profileId}")
    @Transactional
    public ResponseEntity<?> updateProfile(@PathVariable Long profileId, @RequestBody Role updatedProfile) {
        Optional<Role> optionalRole = roleRepository.findById(profileId);

        if (optionalRole.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Role existingProfile = optionalRole.get();
        existingProfile.setName(updatedProfile.getName());

        roleRepository.save(existingProfile);
        return ResponseEntity.ok(existingProfile);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<Role> createProfile(@RequestBody RoleDTO roleDTO) {
        if (roleDTO.name() == null || roleDTO.permissions() == null) {
            return ResponseEntity.badRequest().build();
        }

        Role role = new Role();
        role.setName(roleDTO.name());
        role.setPermissions(roleDTO.permissions());

        Role savedProfile = roleRepository.save(role);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedProfile);
    }
}
