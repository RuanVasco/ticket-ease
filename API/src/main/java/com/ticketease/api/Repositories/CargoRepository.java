package com.ticketease.api.Repositories;

import com.ticketease.api.Entities.Cargo;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CargoRepository extends JpaRepository<Cargo, Long> {
	Cargo findByName(String name);

	Optional<Cargo> findById(Long id);
}
