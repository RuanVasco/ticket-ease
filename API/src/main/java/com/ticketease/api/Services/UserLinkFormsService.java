package com.ticketease.api.Services;

import com.ticketease.api.DTO.FormDTO.UserFormLinkDTO;
import com.ticketease.api.Entities.Embeddables.UserLinkFormsId;
import com.ticketease.api.Entities.Form;
import com.ticketease.api.Entities.User;
import com.ticketease.api.Entities.UserFavoriteForms;
import com.ticketease.api.Entities.UserRecentForms;
import com.ticketease.api.Repositories.UserFavoriteFormsRepository;
import com.ticketease.api.Repositories.UserRecentFormsRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserLinkFormsService {

  private final UserRecentFormsRepository userRecentFormsRepository;
  private final UserFavoriteFormsRepository userFavoriteFormsRepository;

  @Transactional
  public void registerRecentForm(User user, Form form) {
    UserLinkFormsId compositeId = new UserLinkFormsId(user.getId(), form.getId());

    UserRecentForms entry =
        userRecentFormsRepository
            .findById(compositeId)
            .orElseGet(
                () -> {
                  UserRecentForms newEntry = new UserRecentForms();
                  newEntry.setId(compositeId);
                  newEntry.setUser(user);
                  newEntry.setForm(form);
                  return newEntry;
                });

    entry.setAccessedAt(LocalDateTime.now());
    userRecentFormsRepository.save(entry);

    List<UserRecentForms> allRecents =
        userRecentFormsRepository.findByUserOrderByAccessedAtDesc(user);
    if (allRecents.size() > 10) {
      userRecentFormsRepository.deleteAll(allRecents.subList(10, allRecents.size()));
    }
  }

  public List<UserFormLinkDTO> findTop10RecentByUserOrderByAccessedAtDesc(User user) {
    List<UserRecentForms> userRecentForms =
        userRecentFormsRepository.findTop10ByUserOrderByAccessedAtDesc(user);

    return userRecentForms.stream().map(UserFormLinkDTO::fromUserRecentForms).toList();
  }

  public List<UserFormLinkDTO> findFavoriteByUser(User user) {
    List<UserFavoriteForms> userFavoriteForms = userFavoriteFormsRepository.findByUser(user);

    return userFavoriteForms.stream().map(UserFormLinkDTO::fromUserFavoriteForms).toList();
  }

  @Transactional
  public void favoriteForm(User user, Form form) {
    UserLinkFormsId id = new UserLinkFormsId(user.getId(), form.getId());

    boolean exists = userFavoriteFormsRepository.existsById(id);
    if (!exists) {
      UserFavoriteForms favorite = new UserFavoriteForms();
      favorite.setId(id);
      favorite.setUser(user);
      favorite.setForm(form);
      userFavoriteFormsRepository.save(favorite);
    }
  }

  @Transactional
  public void unfavoriteForm(User user, Form form) {
    UserLinkFormsId id = new UserLinkFormsId(user.getId(), form.getId());

    if (userFavoriteFormsRepository.existsById(id)) {
      userFavoriteFormsRepository.deleteById(id);
    }
  }
}
