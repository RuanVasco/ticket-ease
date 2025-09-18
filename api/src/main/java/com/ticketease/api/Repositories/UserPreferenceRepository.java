package com.ticketease.api.Repositories;

import com.ticketease.api.Entities.User;
import com.ticketease.api.Entities.UserPreference;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserPreferenceRepository extends JpaRepository<UserPreference, Long> {

	List<UserPreference> findByUser(User user);
}
