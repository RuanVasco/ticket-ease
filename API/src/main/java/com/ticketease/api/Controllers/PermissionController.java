package com.ticketease.api.Controllers;

import com.ticketease.api.Repositories.PermissionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("permissions")
public class PermissionController {
  private final PermissionRepository permissionRepository;

  public PermissionController(PermissionRepository permissionRepository) {
    this.permissionRepository = permissionRepository;
  }

  @GetMapping
  public ResponseEntity<?> getAll() {
    return ResponseEntity.ok(permissionRepository.findAll());
  }
}
