package com.ticketease.api.Repositories;

import com.ticketease.api.Entities.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
}
