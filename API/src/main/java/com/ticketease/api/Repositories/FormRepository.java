package com.ticketease.api.Repositories;

import com.ticketease.api.Entities.Form;
import com.ticketease.api.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FormRepository extends JpaRepository<Form, Long> {
    List<Form> findByCreator(User creator);
}