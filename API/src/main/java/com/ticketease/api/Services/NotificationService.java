package com.ticketease.api.Services;

import com.ticketease.api.Entities.Notification;
import com.ticketease.api.Entities.User;
import com.ticketease.api.Repositories.NotificationRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

  private final SimpMessagingTemplate simpMessagingTemplate;
  private final NotificationRepository notificationRepository;

  public NotificationService(
      SimpMessagingTemplate messagingTemplate, NotificationRepository notificationRepository) {
    this.simpMessagingTemplate = messagingTemplate;
    this.notificationRepository = notificationRepository;
  }

  public void createNotification(User user, Long referenceId, String type, String content) {
    Notification notification = new Notification(user, content, referenceId, type);
    notificationRepository.save(notification);
    sendNotification(notification);
  }

  public void sendNotification(Notification notification) {
    simpMessagingTemplate.convertAndSendToUser(
        notification.getUser().getUsername(), "/queue/notifications", notification);
  }
}
