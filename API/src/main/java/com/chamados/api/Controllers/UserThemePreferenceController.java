package com.chamados.api.Controllers;

import com.chamados.api.Entities.UserThemePreference;
import com.chamados.api.Repositories.UserThemePreferenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("theme")
public class UserThemePreferenceController {
    @Autowired
    private UserThemePreferenceRepository themeRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<String> getUserTheme(@PathVariable Long userId) {
        String themePreference = themeRepository.findThemeByUserId(userId);
        if (themePreference != null) {
            return ResponseEntity.ok(themePreference);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{userId}")
    public ResponseEntity<Void> setUserTheme(@PathVariable Long userId, @RequestBody String theme) {
        Optional<UserThemePreference> existingPreference = themeRepository.findByUserId(userId);
        UserThemePreference preference = existingPreference.orElse(new UserThemePreference());
        preference.setUserId(userId);
        preference.setTheme(theme);
        themeRepository.save(preference);
        return ResponseEntity.ok().build();
    }
}
