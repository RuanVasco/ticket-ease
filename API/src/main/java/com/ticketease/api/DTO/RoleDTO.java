package com.ticketease.api.DTO;

import com.ticketease.api.Entities.Permission;

import java.util.Set;

public record RoleDTO (String name, Set<Permission> permissions){};
