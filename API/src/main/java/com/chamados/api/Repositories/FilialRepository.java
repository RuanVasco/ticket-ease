package com.chamados.api.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.chamados.api.Entities.Filial;

@Repository
public interface FilialRepository extends JpaRepository<Filial, Long> {
	
}