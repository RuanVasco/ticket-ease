package com.chamados.api.Components.Config;

import com.chamados.api.Authorizations.GenericAuthorizationManager;
import com.chamados.api.Entities.*;
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

    @Bean
    public GenericAuthorizationManager ticketsAuthorizationManager() {
        return new GenericAuthorizationManager(Ticket.class);
    }

    @Bean
    public GenericAuthorizationManager ticketCategoryAuthorizationManager() {
        return new GenericAuthorizationManager(TicketCategory.class);
    }

    @Bean
    public GenericAuthorizationManager userAuthorizationManager() {
        return new GenericAuthorizationManager(User.class);
    }

    @Bean
    public GenericAuthorizationManager cargoAuthorizationManager() {
        return new GenericAuthorizationManager(Cargo.class);
    }

    @Bean
    public GenericAuthorizationManager roleAuthorizationManager() {
        return new GenericAuthorizationManager(Role.class);
    }

    @Bean
    public GenericAuthorizationManager messageAuthorizationManager() {
        return new GenericAuthorizationManager(Message.class);
    }
}