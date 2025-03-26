package com.ticketease.api.Repositories;

import com.ticketease.api.Entities.User;
import com.ticketease.api.Entities.UserRoleDepartment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRoleDepartmentRepository extends JpaRepository<UserRoleDepartment, Long> {
    List<UserRoleDepartment> findByUser(User user);
    void deleteByUser(User user);
}
