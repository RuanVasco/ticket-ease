package com.ticketease.api.Repositories;

import com.ticketease.api.Entities.TicketCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface TicketCategoryRepository extends JpaRepository<TicketCategory, Long> {
    List<TicketCategory> findByDepartmentIdIn(List<Long> departmentIds);

    @Query("SELECT tc FROM TicketCategory tc WHERE tc.father IS NULL AND tc.department IS NOT NULL")
    List<TicketCategory> findAllRoot();

    @Query("SELECT tc FROM TicketCategory tc WHERE tc.father.id = :fatherId")
    List<TicketCategory> findByFather(@Param("fatherId") Long fatherId);
}
