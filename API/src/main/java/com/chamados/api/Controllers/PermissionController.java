package com.chamados.api.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/permissions")
public class PermissionController {
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
}
