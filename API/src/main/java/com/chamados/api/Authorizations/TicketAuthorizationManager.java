package com.chamados.api.Authorizations;

import com.chamados.api.Entities.Ticket;
import com.chamados.api.Entities.User;
import com.chamados.api.Repositories.TicketRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.access.intercept.RequestAuthorizationContext;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.function.Supplier;

@Component
public class TicketAuthorizationManager implements AuthorizationManager<RequestAuthorizationContext> {

    private static final Logger logger = LoggerFactory.getLogger(TicketAuthorizationManager.class);

    @Autowired
    private TicketRepository ticketRepository;

    @Override
    public AuthorizationDecision check(Supplier<Authentication> authentication, RequestAuthorizationContext context) {
        Authentication auth = authentication.get();

        if (auth == null || auth.getPrincipal() == null) {
            return new AuthorizationDecision(false);
        }

        if (!(auth.getPrincipal() instanceof User user)) {
            return new AuthorizationDecision(false);
        }

        String method = context.getRequest().getMethod();
        String path = context.getRequest().getRequestURI();

        if (method.equals("GET") && path.equals("/tickets/user")) {
            return new AuthorizationDecision(user.hasPermission("VIEW_TICKET"));
        }

        if (method.equals("GET") && path.matches("^/tickets/\\d+$")) {
            Long ticketID = extractTicketId(path);
            return new AuthorizationDecision(canViewTicket(user, ticketID));
        }

        if (method.equals("POST") && path.matches("/tickets/")) {
            return new AuthorizationDecision(user.hasPermission("CREATE_TICKET"));
        }

        return new AuthorizationDecision(false);
    }

    private boolean canViewTicket(User user, Long ticketID) {
        Optional<Ticket> optionalTicket = ticketRepository.findById(ticketID);

        if (optionalTicket.isEmpty()) {
            return false;
        }

        Ticket ticket = optionalTicket.get();

        return ticket.canManage(user);
    }

    private Long extractTicketId(String path) {
        try {
            String[] parts = path.split("/");
            return Long.parseLong(parts[2]);
        } catch (Exception e) {
            logger.error("Erro ao extrair ticket ID do caminho: {}", path, e);
            return null;
        }
    }
}
