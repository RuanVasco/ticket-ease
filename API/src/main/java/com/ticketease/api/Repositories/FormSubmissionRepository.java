package com.ticketease.api.Repositories;

import com.ticketease.api.Entities.Form;
import com.ticketease.api.Entities.FormSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FormSubmissionRepository extends JpaRepository<FormSubmission, Long> {
    List<FormSubmission> findByForm(Form form);
}