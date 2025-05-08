package com.ticketease.api.Repositories;

import com.ticketease.api.Entities.Notification;
import com.ticketease.api.Entities.User;
import java.util.List;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
	Set<Notification> findByUserOrderByCreatedAtDesc(User user);

	List<Notification> findByUserAndReadFalse(User user);
}
