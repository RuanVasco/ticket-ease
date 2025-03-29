package com.ticketease.api.Controllers;

import com.ticketease.api.Entities.Notification;
import com.ticketease.api.Entities.User;
import com.ticketease.api.Repositories.NotificationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("notifications")
public class NotificationsController {

    private final NotificationRepository notificationRepository;

    public NotificationsController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @PatchMapping("{notificationId}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long notificationId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<Notification> optionalNotification = notificationRepository.findById(notificationId);

        if (optionalNotification.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Notification notification = optionalNotification.get();

        if (!notification.getUser().equals(user)) {
            return new ResponseEntity<>("Acesso negado. Você não tem permissão para ler notificações de outro usuário.", HttpStatus.FORBIDDEN);
        }

        notification.setRead(true);
        notificationRepository.save(notification);

        return ResponseEntity.ok("Notificação marcada como lida.");
    }

    @PatchMapping("/mark-all-read")
    public ResponseEntity<?> markAllAsRead() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        List<Notification> unreadNotifications = notificationRepository.findByUserAndReadFalse(user);

        if (unreadNotifications.isEmpty()) {
            return ResponseEntity.ok("Nenhuma notificação não lida encontrada.");
        }

        unreadNotifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unreadNotifications);

        return ResponseEntity.ok("Todas as notificações foram marcadas como lidas.");
    }

    @GetMapping
    public ResponseEntity<Set<Notification>> getNotifications() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Set<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        return ResponseEntity.ok(notifications);
    }

}
