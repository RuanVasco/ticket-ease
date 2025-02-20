package com.chamados.api.Services;

import com.chamados.api.Entities.Permission;
import com.chamados.api.Entities.Role;
import com.chamados.api.Repositories.PermissionRepository;
import com.chamados.api.Repositories.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
public class CustomPermissionService {

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private RoleRepository roleRepository;

    public Set<Permission> getPermissionsForRole(String roleName) {
        Optional<Role> roleOpt = roleRepository.findByName(roleName);

        if (roleOpt.isPresent()) {
            return roleOpt.get().getPermissions();
        } else {
            throw new RuntimeException("Role not found: " + roleName);
        }
    }

    public void addPermissionToRole(String roleName, String permissionName) {
        Optional<Role> roleOpt = roleRepository.findByName(roleName);
        Permission permission = permissionRepository.findByName(permissionName);

        if (roleOpt.isEmpty()) {
            throw new RuntimeException("Role not found: " + roleName);
        }

        if (permission == null) {
            throw new RuntimeException("Permission not found: " + permissionName);
        }

        Role role = roleOpt.get();
        role.getPermissions().add(permission);
        roleRepository.save(role);
    }

    public void removePermissionFromRole(String roleName, String permissionName) {
        Optional<Role> roleOpt = roleRepository.findByName(roleName);
        Permission permission = permissionRepository.findByName(permissionName);

        if (roleOpt.isEmpty()) {
            throw new RuntimeException("Role not found: " + roleName);
        }

        if (permission == null) {
            throw new RuntimeException("Permission not found: " + permissionName);
        }

        Role role = roleOpt.get();
        role.getPermissions().remove(permission);
        roleRepository.save(role);
    }

    public boolean hasPermission(String roleName, String permissionName) {
        Set<Permission> permissions = getPermissionsForRole(roleName);
        return permissions.stream().anyMatch(permission -> permission.getName().equals(permissionName));
    }
}
