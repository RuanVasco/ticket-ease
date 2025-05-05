package com.ticketease.api.Repositories;

import com.ticketease.api.Entities.Form;
import com.ticketease.api.Entities.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FormRepository extends JpaRepository<Form, Long> {
	List<Form> findByCreator(User creator);

	@Query("SELECT f FROM Form f WHERE f.ticketCategory.id = :category_id")
	List<Form> findByTicketCategoryId(@Param("category_id") Long categoryId);

	@Query("SELECT f FROM Form f WHERE " +
		"f.title LIKE %:value% OR " +
		"f.description LIKE %:value% OR " +
		"f.department.name LIKE %:value%")
	List<Form> findByValue(@Param("value") String value);
}
