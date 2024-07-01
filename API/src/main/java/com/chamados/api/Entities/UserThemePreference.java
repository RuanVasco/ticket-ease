package com.chamados.api.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "userThemePreferences")
public class UserThemePreference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    @Setter
    @Column(name = "user_id", unique = true)
    private Long userId;

    @Getter
    @Setter
    @Column(name = "theme")
    private String theme;

}
