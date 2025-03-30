package com.ticketease.api.Repositories;

import com.ticketease.api.Entities.FieldResponse;
import com.ticketease.api.Entities.FormSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FieldResponseRepository extends JpaRepository<FieldResponse, Long> {
    List<FieldResponse> findBySubmission(FormSubmission submission);
}