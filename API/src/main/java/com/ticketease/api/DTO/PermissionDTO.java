package com.ticketease.api.DTO;

import com.ticketease.api.Types.ScopeType;

public record PermissionDTO(
        String name,
        ScopeType scope,
        String departmentName,
        Long departmentId
) {}