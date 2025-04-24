package com.ticketease.api.Repositories;

import com.ticketease.api.Entities.Embeddables.UserLinkFormsId;
import com.ticketease.api.Entities.User;
import com.ticketease.api.Entities.UserFavoriteForms;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserFavoriteFormsRepository
    extends JpaRepository<UserFavoriteForms, UserLinkFormsId> {
  List<UserFavoriteForms> findByUser(User user);
}
