package com.chamados.api.Repositories;

import com.chamados.api.Entities.Cargo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CargoRepository extends JpaRepository<Cargo, Long> {
    Cargo findByName(String name);
}
