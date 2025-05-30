package com.ticketease.api.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.*;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

@Getter
@Entity(name = "User")
@Table(name = "users")
public class User implements UserDetails {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Setter
	@Column(nullable = false)
	private String name;

	@Setter
	private String phone;

	@Setter
	@Column(unique = true, nullable = false)
	private String email;

	@JsonIgnore
	@Column(nullable = false)
	private String password;

	@OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
	@JsonManagedReference
	@JsonIgnore
	private Set<UserRoleDepartment> roleBindings = new HashSet<>();

	@Setter
	@ManyToOne
	@JoinColumn(name = "cargo_id")
	private Cargo cargo;

	public void setPassword(String password, PasswordEncoder passwordEncoder) {
		this.password = passwordEncoder.encode(password);
	}

	public boolean hasPermissionInAnyDepartment(String permissionName) {
		if (permissionName == null || permissionName.isEmpty())
			return false;

		return roleBindings.stream().map(UserRoleDepartment::getRole).flatMap(role -> role.getPermissions().stream())
				.anyMatch(permission -> permissionName.equals(permission.getName()));
	}

	public boolean hasPermission(String permissionName, Department department) {
		if (permissionName == null || permissionName.isEmpty()) {
			return false;
		}

		for (UserRoleDepartment binding : this.roleBindings) {
			Role role = binding.getRole();
			Department bindingDept = binding.getDepartment();

			for (Permission permission : role.getPermissions()) {
				if (permissionName.equals(permission.getName())
						&& (bindingDept == null || (bindingDept.equals(department)))) {
					return true;
				}
			}
		}

		return false;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return this.roleBindings.stream().flatMap(binding -> binding.getRole().getPermissions().stream())
				.map(permission -> new SimpleGrantedAuthority(permission.getName())).collect(Collectors.toSet());
	}

	@Override
	public String getUsername() {
		return this.email;
	}

	@Override
	public boolean isAccountNonExpired() {
		return UserDetails.super.isAccountNonExpired();
	}

	@Override
	public boolean isAccountNonLocked() {
		return UserDetails.super.isAccountNonLocked();
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return UserDetails.super.isCredentialsNonExpired();
	}

	@Override
	public boolean isEnabled() {
		return UserDetails.super.isEnabled();
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null || getClass() != obj.getClass())
			return false;
		User user = (User) obj;
		return Objects.equals(id, user.id);
	}

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}
}
