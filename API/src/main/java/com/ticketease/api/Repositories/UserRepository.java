package com.ticketease.api.Repositories;

import com.ticketease.api.Entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    void deleteById(Long id);

    @Query("SELECT DISTINCT u FROM User u JOIN u.roleBindings b")
    List<User> findAllUsersWithRoles();

    Page<User> findAll(Pageable pageable);
}
