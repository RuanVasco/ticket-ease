package com.ticketease.api.Repositories;

import com.ticketease.api.Entities.Form;
import com.ticketease.api.Entities.FormField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FormFieldRepository extends JpaRepository<FormField, Long> {
    List<FormField> findByForm(Form form);
}