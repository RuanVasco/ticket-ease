package com.chamados.api.DTO;

import com.chamados.api.Entities.Permission;

import java.util.Set;

public record RoleDTO (String name, Set<Permission> permissions){};
