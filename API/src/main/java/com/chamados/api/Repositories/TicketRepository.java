package com.chamados.api.Repositories;

import com.chamados.api.Entities.Ticket;
import com.chamados.api.Entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.domain.Pageable;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    @Query("SELECT t FROM Ticket t WHERE " +
            "(LOWER(t.name) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
            "LOWER(t.description) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
            "LOWER(t.observation) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
            "LOWER(t.ticketCategory.name) LIKE LOWER(CONCAT('%', :searchText, '%'))) AND " +
            "(:userReq IS NULL OR t.user = :userReq)")
    List<Ticket> findBySearch(@Param("searchText") String searchText, @Param("userReq") User userReq);

    @Query("SELECT t FROM Ticket t WHERE (:status = 'ALL' OR LOWER(t.status) = LOWER(:status))")
    Page<Ticket> findByStatus(@Param("status") String status, Pageable pageable);

    Page<Ticket> findByUserId(Long userId, Pageable pageable);

    @Query("SELECT t FROM Ticket t WHERE " +
            "(:userId IS NULL OR t.user.id = :userId) AND " +
            "(:status = 'ALL' OR LOWER(t.status) = LOWER(:status))")
    Page<Ticket> findByUserIdAndStatus(
            @Param("userId") Long userId,
            @Param("status") String status,
            Pageable pageable
    );

    @Query("SELECT t FROM Ticket t WHERE " +
            "(:status = 'ALL' OR LOWER(t.status) = LOWER(:status)) AND " +
            "(LOWER(t.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            " LOWER(t.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            " LOWER(t.observation) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            " LOWER(t.ticketCategory.name) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Ticket> findByStatusAndQuery(
            @Param("status") String status,
            @Param("query") String query,
            Pageable pageable
    );

    @Query("SELECT t FROM Ticket t WHERE " +
            "(:status = 'ALL' OR LOWER(t.status) = LOWER(:status)) AND " +
            "(LOWER(t.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            " LOWER(t.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            " LOWER(t.observation) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            " LOWER(t.ticketCategory.name) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
            "t.user = :user")
    Page<Ticket> findByUserAndStatus(
            @Param("user") User user,
            @Param("status") String status,
            @Param("query") String query,
            Pageable pageable
    );

}
