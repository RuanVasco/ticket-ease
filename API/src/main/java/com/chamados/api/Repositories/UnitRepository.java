package com.chamados.api.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.chamados.api.Entities.Unit;

public interface UnitRepository extends JpaRepository<Unit, Long> {
    Optional<Unit> findByName(String name);
}
