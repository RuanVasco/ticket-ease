package com.ticketease.api.Repositories;

import java.util.Optional;

import com.ticketease.api.Entities.Unit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UnitRepository extends JpaRepository<Unit, Long> {
    Optional<Unit> findByName(String name);
}
