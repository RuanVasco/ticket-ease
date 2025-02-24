package com.chamados.api.Authorizations;

import com.chamados.api.Entities.Department;
import com.chamados.api.Entities.User;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.access.intercept.RequestAuthorizationContext;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.function.Supplier;

@Component
public class DepartmentAuthorizationManager implements AuthorizationManager<RequestAuthorizationContext> {

    private static final Logger logger = LoggerFactory.getLogger(DepartmentAuthorizationManager.class);

    public DepartmentAuthorizationManager() {
        logger.info("DepartmentAuthorizationManager registrado!");
    }

    @Override
    public AuthorizationDecision check(Supplier<Authentication> authentication, RequestAuthorizationContext context) {
        Authentication auth = authentication.get();

        if (auth == null || auth.getPrincipal() == null) {
            logger.warn("Tentativa de acesso sem autenticação válida.");
            return new AuthorizationDecision(false);
        }

        if (!(auth.getPrincipal() instanceof User user)) {
            logger.warn("Tentativa de acesso com um tipo de usuário inválido.");
            return new AuthorizationDecision(false);
        }

        boolean canManage = Department.canCreate(user);
        logger.info("Autorização para {}: {}", user.getEmail(), canManage);

        return new AuthorizationDecision(canManage);
    }
}
