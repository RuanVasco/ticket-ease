package com.chamados.api.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.chamados.api.Entities.Setor;

@Repository
public interface SetorRepository extends JpaRepository<Setor, Long> {
	
}