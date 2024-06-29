package com.chamados.api.DTO;

import lombok.Data;

@Data
public class RegisterDTO {
    private String name;
    private String email;
    private String password;
    private String role;
    
	public String getEmail() {
		return this.email;
	}

	public String getName() {
		return this.name;
	}

	public CharSequence getPassword() {		
		return this.password;
	}

	public String getRole() {
		return this.role;
	}
}