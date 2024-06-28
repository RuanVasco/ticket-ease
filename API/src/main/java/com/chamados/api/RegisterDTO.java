package com.chamados.api;

import com.chamados.api.Enums.UserRole;

public record RegisterDTO(String name, String email, String password, UserRole role) {
	
}
