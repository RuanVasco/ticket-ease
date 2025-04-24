package com.ticketease.api.Repositories;

import com.ticketease.api.Entities.Department;
import com.ticketease.api.Entities.Ticket;
import com.ticketease.api.Enums.StatusEnum;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Set;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    @Query("""
        SELECT t
        FROM Ticket t
        LEFT JOIN t.observers obs
        WHERE t.user.id = :userId
           OR obs.id = :userId
        """)
    Page<Ticket> findByOwnerOrObserver(@Param("userId") Long userId, Pageable pageable);

    @Query("""
        SELECT t
        FROM Ticket t
        LEFT JOIN t.observers obs
        WHERE (t.user.id = :userId OR obs.id = :userId)
          AND t.status = :status
    """)
    Page<Ticket> findByOwnerOrObserverAndStatus(@Param("userId") Long userId,
                                                @Param("status") StatusEnum status,
                                                Pageable pageable);


    Set<Ticket> findByStatus(StatusEnum status);

    @Query("""
        SELECT t FROM Ticket t
        JOIN t.form.approvers approver
        WHERE approver.id = :approverId
        AND t.status = :status
    """)
    Page<Ticket> findPendingTicketsByApprover(
            @Param("approverId") Long approverId,
            @Param("status") StatusEnum status,
            Pageable pageable
    );
}
