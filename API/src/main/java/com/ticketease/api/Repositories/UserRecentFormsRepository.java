package com.ticketease.api.Repositories;

import com.ticketease.api.Entities.Embeddables.UserLinkFormsId;
import com.ticketease.api.Entities.Form;
import com.ticketease.api.Entities.User;
import com.ticketease.api.Entities.UserRecentForms;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRecentFormsRepository extends JpaRepository<UserRecentForms, UserLinkFormsId> {

    Optional<UserRecentForms> findByUserAndForm(User user, Form form);

    List<UserRecentForms> findByUserOrderByAccessedAtDesc(User user);

    List<UserRecentForms> findTop10ByUserOrderByAccessedAtDesc(User user);
}
