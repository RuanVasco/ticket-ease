package com.chamados.api.Controllers;

import com.chamados.api.Entities.Permission;
import com.chamados.api.Entities.Role;
import com.chamados.api.Repositories.PermissionRepository;
import com.chamados.api.Repositories.RoleRepository;
import com.chamados.api.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/permissions")
public class PermissionController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/has-permission")
    public ResponseEntity<?> checkPermission(
            @RequestParam String action,
            @RequestParam String entity,
            Authentication authentication) {

        String requiredAuthority = action.toUpperCase() + "_" + entity.toUpperCase();

        boolean hasPermission = authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals(requiredAuthority));

        if (hasPermission) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.ok(false);
        }
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> getPermissionsFromUser(@PathVariable Long id) {
        List<Permission> permissions = userRepository.findPermissionsByUserId(id);

        if (permissions.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(permissions);
    }
}


