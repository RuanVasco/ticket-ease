package com.chamados.api.Authorizations;

import com.chamados.api.Entities.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.access.intercept.RequestAuthorizationContext;

import java.lang.reflect.Method;
import java.util.function.Supplier;


public class GenericAuthorizationManager implements AuthorizationManager<RequestAuthorizationContext> {

    private static final Logger logger = LoggerFactory.getLogger(GenericAuthorizationManager.class);

    private final Class<?> entityClass;

    public GenericAuthorizationManager(Class<?> entityClass) {
        this.entityClass = entityClass;
    }

    @Override
    public AuthorizationDecision check(Supplier<Authentication> authentication, RequestAuthorizationContext context) {
        Authentication auth = authentication.get();

        if (auth == null || auth.getPrincipal() == null) {
            return new AuthorizationDecision(false);
        }

        if (!(auth.getPrincipal() instanceof User user)) {
            return new AuthorizationDecision(false);
        }

        boolean canAccess = false;
        String method = context.getRequest().getMethod();
        String action = getActionFromMethod(method);

        try {
            Method canMethod = entityClass.getMethod(action, User.class);
            canAccess = (boolean) canMethod.invoke(null, user);
        } catch (Exception e) {
            logger.error("Erro ao verificar autorização para o método: {}", action, e);
        }

        return new AuthorizationDecision(canAccess);
    }

    private String getActionFromMethod(String method) {
        return switch (method) {
            case "POST" -> "canCreate";
            case "PUT" -> "canUpdate";
            case "DELETE" -> "canDelete";
            default -> "canView";
        };
    }
}
