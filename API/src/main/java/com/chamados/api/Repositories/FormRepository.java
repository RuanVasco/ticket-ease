package com.chamados.api.Repositories;

import com.chamados.api.Entities.Cargo;
import com.chamados.api.Entities.Form;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FormRepository extends JpaRepository<Form, Long> {
    Optional<Form> findById(Long id);
}
