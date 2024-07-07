package com.chamados.api.Components;

import java.util.Collection;
import java.util.Collections;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.chamados.api.Entities.User;

import lombok.Getter;

@Getter
public class UserDetailsImpl implements UserDetails {
	
	private final User user;
	
	public UserDetailsImpl(User user) {
		if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
		
        this.user = user;
    }

	@Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (user.getRoles() == null) {
        	return Collections.emptyList();
        }
        return ((Collection<? extends GrantedAuthority>) user.getRoles())
                .stream()
                .map(role -> new SimpleGrantedAuthority(role.getAuthority()))
                .collect(Collectors.toList());
    }
	
	public User getUser() {
        return this.user;
    }

	@Override
	public String getPassword() {
		return user.getPassword();
	}

	@Override
	public String getUsername() {
		return user.getEmail();
	}
	
	@Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
