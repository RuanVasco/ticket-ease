package com.chamados.api;

import com.chamados.api.Enums.RoleName;

public record RegisterDTO(String name, String email, String password, RoleName role) {
	
}
