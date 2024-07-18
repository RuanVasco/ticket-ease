package com.chamados.api.Repositories;

import com.chamados.api.DTO.UserDTO;
import com.chamados.api.Entities.User;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT new com.chamados.api.DTO.UserDTO(u.id, u.name, u.email, u.department, u.cargo) " +
            "FROM User u " +
            "LEFT JOIN u.department d " +
            "LEFT JOIN u.cargo c")
    List<UserDTO> findAllWithoutPassword();

    User findByEmail(String email);
    Boolean existsByEmail(String email);
}
