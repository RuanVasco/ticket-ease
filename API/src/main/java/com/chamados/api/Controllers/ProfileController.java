package com.chamados.api.Controllers;

import com.chamados.api.Entities.Permission;
import com.chamados.api.Entities.Role;
import com.chamados.api.Repositories.PermissionRepository;
import com.chamados.api.Repositories.RoleRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("profiles")
public class ProfileController {

    @Autowired
    private RoleRepository roleRepository;

    private final PermissionRepository permissionRepository;

    public ProfileController(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

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

    @PutMapping("/{profileId}")
    @Transactional
    public ResponseEntity<?> updateProfile(@PathVariable Long profileId, @RequestBody Role updatedProfile) {
        Optional<Role> optionalRole = roleRepository.findById(profileId);

        if (optionalRole.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Role existingProfile = optionalRole.get();
        existingProfile.setName(updatedProfile.getName());

        Set<Permission> permissionSet = new HashSet<>();

        for (Permission permission : updatedProfile.getPermissions()) {
            Optional<Permission> existingPermission = Optional.ofNullable(permissionRepository.findByName(permission.getName()));

            existingPermission.ifPresent(permissionSet::add);
        }

        existingProfile.setPermissions(permissionSet);

        roleRepository.save(existingProfile);
        return ResponseEntity.ok(existingProfile);
    }
}
