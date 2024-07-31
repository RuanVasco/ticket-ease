package com.chamados.api.Repositories;

import com.chamados.api.Entities.TicketCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketCategoryRepository extends JpaRepository<TicketCategory, Long> {
    List<TicketCategory> findByHide(Boolean option);
}
