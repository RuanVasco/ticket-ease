package com.chamados.api.Services;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.chamados.api.Entities.User;

@Service
public class TokenService {
	
	@Value("${api.security.token.secret}")
	public String secret;
	
	@Value("${jwt.refresh.expiration}")
	private Long refreshExpiration;
	
	public String generateToken(User user) {
		try {
			Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.create()
					.withIssuer("auth-api")
					.withClaim("id", user.getId())
					.withSubject(user.getEmail())
					.withExpiresAt(getExpirationDate())
					.sign(algorithm);
		} catch (JWTCreationException exception) {
			throw new RuntimeException("error while generating token", exception);
		}
	}
	
	public String generateRefreshToken(User user){
		try {
			Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.create()
					.withIssuer("auth-api")
					.withSubject(user.getEmail())
					.withExpiresAt(getExpirationDate())
					.sign(algorithm);
		} catch (JWTCreationException exception) {
			throw new RuntimeException("error while generating refresh token", exception);
		}
    }
	
	public String validateToken(String token) {
		try {
			Algorithm algorithm = Algorithm.HMAC256(secret);
			return JWT.require(algorithm)
					.withIssuer("auth-api")
					.build()
					.verify(token)
					.getSubject();
		} catch (JWTVerificationException exception) {
			return "";
		}
	}
	
	private Instant getExpirationDate() {
		return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
	}
	
}
