package com.chamados.api.Services;

import com.chamados.api.Entities.Notification;
import com.chamados.api.Entities.User;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendNotification(User user, Notification notification) {
        messagingTemplate.convertAndSend("/queue/user/" + user.getId() + "/notifications", notification);
    }
}
