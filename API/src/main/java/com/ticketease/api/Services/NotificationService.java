package com.ticketease.api.Services;

import com.ticketease.api.Entities.Notification;
import com.ticketease.api.Entities.User;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void createNotification(User user, Long referenceId, String type, String content) {
        sendNotification(new Notification(user, content, referenceId, type));
    }

    public void sendNotification(Notification notification) {
        messagingTemplate.convertAndSend("/queue/user/" + notification.getUser().getId() + "/notifications", notification);
    }
}
