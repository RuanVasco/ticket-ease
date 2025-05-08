package com.ticketease.api.Components.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${cors.allowed-origins:http://localhost:5173}")
	private String corsOrigins;

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		String[] origins = corsOrigins.split(",");
		registry.addMapping("/**")
				.allowedHeaders("*")
				.allowedOrigins(origins)
				.allowedMethods("*");
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/images/**").addResourceLocations("file:uploads/");
	}
}
