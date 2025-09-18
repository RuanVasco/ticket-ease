package com.ticketease.api.Services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.nimbusds.jose.JOSEException;
import com.ticketease.api.Components.TokenUtils;
import com.ticketease.api.Entities.User;
import com.ticketease.api.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Optional;

@Service
public class TokenService {

	private final UserRepository userRepository;
	private final TokenUtils tokenUtils;
	@Value("${api.security.token.secret}")
	private String secret;
	@Value("${jwt.access.expiration}")
	private Long accessExpiration;
	@Value("${jwt.refresh.expiration}")
	private Long refreshExpiration;

	public TokenService(UserRepository userRepository, TokenUtils tokenUtils) {
		this.userRepository = userRepository;
		this.tokenUtils = tokenUtils;
	}

	public String generateAccessToken(User user) {
		try {
			Algorithm algorithm = Algorithm.HMAC256(secret);

			return JWT.create().withIssuer("auth-api").withSubject(user.getEmail()).withClaim("id", user.getId())
				.withClaim("name", user.getName()).withExpiresAt(getExpirationDate(accessExpiration))
				.sign(algorithm);
		} catch (JWTCreationException exception) {
			throw new RuntimeException("Error while generating access token", exception);
		}
	}

	public User getUserFromToken(String token) throws ParseException, JOSEException {
		Long userId = decodeUserIdFromToken(token);

		Optional<User> optionalUser = userRepository.findById(userId);

		return optionalUser.orElse(null);
	}

	private Long decodeUserIdFromToken(String token) throws ParseException, JOSEException {
		return tokenUtils.extractUserId(token);
	}

	public String generateRefreshToken(User user) {
		try {
			Algorithm algorithm = Algorithm.HMAC256(secret);
			return JWT.create().withIssuer("auth-api").withSubject(user.getEmail())
				.withExpiresAt(getExpirationDate(refreshExpiration)).sign(algorithm);
		} catch (JWTCreationException exception) {
			throw new RuntimeException("Error while generating refresh token", exception);
		}
	}

	public String validateToken(String token) {
		try {
			Algorithm algorithm = Algorithm.HMAC256(secret);
			return JWT.require(algorithm).withIssuer("auth-api").build().verify(token).getSubject();
		} catch (JWTVerificationException exception) {
			return null;
		}
	}

	private Instant getExpirationDate(Long expirationHours) {
		return LocalDateTime.now().plusHours(expirationHours).toInstant(ZoneOffset.of("-03:00"));
	}
}
