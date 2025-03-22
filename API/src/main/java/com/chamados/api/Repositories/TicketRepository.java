package com.chamados.api.Repositories;

import com.chamados.api.Entities.Department;
import com.chamados.api.Entities.Ticket;
import com.chamados.api.Entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

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

    @Query("SELECT t FROM Ticket t WHERE t.id = :ticketId AND t.user = :user")
    Optional<Ticket> findByIdAndUser(@Param("user") User user, @Param("ticketId") Long ticketId);

    @Query("SELECT t FROM Ticket t WHERE " +
            "(:userId IS NULL OR t.user.id = :userId) AND " +
            "(:status = 'ALL' OR LOWER(t.status) = LOWER(:status))")
    Page<Ticket> findByUserIdAndStatus(
            @Param("userId") Long userId,
            @Param("status") String status,
            Pageable pageable
    );

    @Query("SELECT t.id FROM Ticket t WHERE " +
            "(:userId IS NULL OR t.user.id = :userId) AND " +
            "(:status = 'ALL' OR LOWER(t.status) = LOWER(:status))")
    List<Ticket> findTicketsByUserIdAndStatus(@Param("userId") Long userId, @Param("status") String status);

    @Query("SELECT t FROM Ticket t WHERE " +
            "(:userId IS NULL OR t.user.id = :userId) AND " +
            "(:status = 'ALL' OR LOWER(t.status) = LOWER(:status))")
    List<Ticket> findsByUserIdAndStatus(@Param("userId") Long userId, @Param("status") String status);

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
