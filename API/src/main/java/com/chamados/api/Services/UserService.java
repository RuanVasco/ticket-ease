package com.chamados.api.Services;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.chamados.api.Entities.User;
import com.chamados.api.Repositories.UserRepository;
import com.chamados.api.Exceptions.ServiceExc;

@Service
public class UserService {
	
	UserRepository userRepository;	
	PasswordEncoder passwordEncoder;
	
	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
		this.passwordEncoder = new BCryptPasswordEncoder();
	}
	
	public User save(User user) {
		String encodedPassword = this.passwordEncoder.encode(user.getPassword());
		user.setPassword(encodedPassword);
		return this.userRepository.save(user);
	}
	
	public User loginUser(String email, String rawPassword) throws ServiceExc {
		User userLogin = userRepository.findByEmail(email);
		
		if (userLogin != null && passwordEncoder.matches(rawPassword, userLogin.getPassword())) {
			return userLogin;
		}
		
		throw new ServiceExc("Email ou senha inválidos");		
	}
}
