package com.chamados.api.Repositories;

import com.chamados.api.Entities.Form;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FormRepository extends JpaRepository<Form, Long> {
}
