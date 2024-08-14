package com.chamados.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.chamados.api.Components.SecurityFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Autowired
	SecurityFilter securityFilter;
	
	@Bean
    SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
		return httpSecurity
				.csrf(AbstractHttpConfigurer::disable)
				.headers(headers -> headers
						.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin)
	            )
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
							.authorizeHttpRequests(authorize -> authorize
				 			.requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
							.requestMatchers(HttpMethod.POST, "/auth/refresh").permitAll()
							.requestMatchers(HttpMethod.POST, "/auth/validate").permitAll()
							.requestMatchers("/h2-console/**").permitAll()
							.requestMatchers(HttpMethod.POST, "/departments/**").hasRole("ADMIN")
							.requestMatchers(HttpMethod.POST, "/tickets-category/**").hasRole("ADMIN")
							.requestMatchers(HttpMethod.POST, "/units/**").hasRole("ADMIN")
							.requestMatchers(HttpMethod.POST, "/tickets/**").hasRole("USER")
							.requestMatchers(HttpMethod.POST, "/messages/**").hasRole("USER")
							.requestMatchers(HttpMethod.POST, "/users/**").hasRole("ADMIN")
							.requestMatchers(HttpMethod.POST, "/cargos/**").hasRole("ADMIN")
							.requestMatchers(HttpMethod.PUT, "/cargos/**").hasRole("ADMIN")
							.requestMatchers(HttpMethod.PUT, "/users/**").hasRole("ADMIN")
							.requestMatchers(HttpMethod.PUT, "/units/**").hasRole("ADMIN")
							.requestMatchers(HttpMethod.DELETE, "/cargos/**").hasRole("ADMIN")
							.requestMatchers(HttpMethod.DELETE, "/units/**").hasRole("ADMIN")
							.requestMatchers(HttpMethod.DELETE, "/users/**").hasRole("ADMIN")
							.requestMatchers(HttpMethod.GET, "/cargos/**").hasRole("ADMIN")
							.requestMatchers(HttpMethod.GET, "/departments/**").hasRole("USER")
							.requestMatchers(HttpMethod.GET, "/units/**").hasRole("USER")
							.requestMatchers(HttpMethod.GET, "/tickets-category/**").hasRole("USER")
							.requestMatchers(HttpMethod.GET, "/tickets/**").hasRole("USER")
							.requestMatchers(HttpMethod.GET, "/messages/**").hasRole("USER")
							.requestMatchers(HttpMethod.GET, "/users/**").hasRole("ADMIN")
							.requestMatchers(HttpMethod.GET, "/images/**").permitAll()
							.anyRequest().authenticated()
				)
				.addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
				.build();
	}
    
    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
    	return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
    	return new BCryptPasswordEncoder();
    }   
	
}