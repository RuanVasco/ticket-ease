package com.ticketease.api.Controllers;

import com.ticketease.api.DTO.ErrorResponseDTO;
import com.ticketease.api.Exceptions.ResourceNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.Instant;

@ControllerAdvice
public class RestExceptionHandler {

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ErrorResponseDTO> handleResourceNotFound(ResourceNotFoundException ex, HttpServletRequest request) {
		HttpStatus status = HttpStatus.NOT_FOUND;

		ErrorResponseDTO error = new ErrorResponseDTO(
			Instant.now(),
			status.value(),
			status.getReasonPhrase(),
			ex.getMessage(),
			request.getRequestURI()
		);

		return new ResponseEntity<>(error, status);
	}
}
