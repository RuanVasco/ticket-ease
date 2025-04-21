package com.ticketease.api.Controllers;

import com.ticketease.api.DTO.FormDTO.UserFormLinkDTO;
import com.ticketease.api.Entities.Form;
import com.ticketease.api.Entities.User;
import com.ticketease.api.Repositories.FormRepository;
import com.ticketease.api.Services.UserLinkFormsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/users/me")
@RequiredArgsConstructor
public class UserLinkFormsController {

    private final UserLinkFormsService userLinkFormsService;
    private final FormRepository formRepository;

    private User getAuthenticatedUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping("/recent-forms")
    public ResponseEntity<List<UserFormLinkDTO>> getRecentForms() {
        User user = getAuthenticatedUser();
        List<UserFormLinkDTO> recentForms = userLinkFormsService.findTop10RecentByUserOrderByAccessedAtDesc(user);
        return ResponseEntity.ok(recentForms);
    }

    @GetMapping("/favorite-forms")
    public ResponseEntity<List<UserFormLinkDTO>> getFavoriteForms() {
        User user = getAuthenticatedUser();
        List<UserFormLinkDTO> favoriteForms = userLinkFormsService.findFavoriteByUser(user);
        return ResponseEntity.ok(favoriteForms);
    }

    @PostMapping("/favorite/{formId}")
    public ResponseEntity<?> favorite(@PathVariable Long formId) {
        User user = getAuthenticatedUser();

        Form form = formRepository.findById(formId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Formulário não encontrado"));

        userLinkFormsService.favoriteForm(user, form);
        return ResponseEntity.ok("Favoritado com sucesso");
    }
}
