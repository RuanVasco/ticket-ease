package com.chamados.api.Repositories;

import com.chamados.api.Entities.UserThemePreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserThemePreferenceRepository extends JpaRepository<UserThemePreference, Long> {
    Optional<UserThemePreference> findByUserId(Long userId);
    @Query("SELECT u.theme FROM UserThemePreference u WHERE u.userId = :userId")
    String findThemeByUserId(@Param("userId") Long userId);
}
