package com.ticketease.api.Repositories;

import com.ticketease.api.Entities.Embeddables.UserLinkFormsId;
import com.ticketease.api.Entities.User;
import com.ticketease.api.Entities.UserFavoriteForms;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserFavoriteFormsRepository extends JpaRepository<UserFavoriteForms, UserLinkFormsId> {
    List<UserFavoriteForms> findByUser(User user);
}
