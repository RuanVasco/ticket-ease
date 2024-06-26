package com.chamados.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication
public class ChamadosApi {
	public static void main(String[] args) {
		SpringApplication.run(ChamadosApi.class, args);
	}

}
