package com.chamados.api.DTO;

import com.chamados.api.Entities.Cargo;
import com.chamados.api.Entities.Department;
import lombok.Data;
import lombok.Getter;

@Data
public class RegisterDTO {
    private String name;
    private String email;
    private String password;
	@Getter
    private Long cargo_id;
    @Getter
	private Long department_id;

    public CharSequence getPassword() {
		return this.password;
	}
}