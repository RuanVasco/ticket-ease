package com.ticketease.api.Repositories;

import com.ticketease.api.Entities.Permission;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
	Optional<Permission> findByName(String name);
}
