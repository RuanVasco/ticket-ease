package com.chamados.api.Repositories;

import com.chamados.api.Entities.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
    Permission findByName(String permissionName);
}
