package com.chamados.api.Components;

import com.chamados.api.Authorizations.GenericAuthorizationManager;
import com.chamados.api.Entities.Department;
import com.chamados.api.Entities.Unit;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AuthorizationConfig {

    @Bean
    public GenericAuthorizationManager departmentAuthorizationManager() {
        return new GenericAuthorizationManager(Department.class);
    }

    @Bean
    public GenericAuthorizationManager unitAuthorizationManager() {
        return new GenericAuthorizationManager(Unit.class);
    }
}