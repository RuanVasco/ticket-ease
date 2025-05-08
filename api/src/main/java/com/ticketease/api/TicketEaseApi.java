package com.ticketease.api;

import com.ticketease.api.Services.FileStorageService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class TicketEaseApi {

	public static void main(String[] args) {
		SpringApplication.run(TicketEaseApi.class, args);
	}

	@Bean
	CommandLineRunner init(FileStorageService storageService) {
		return (args) -> {
			storageService.init();
		};
	}
}
