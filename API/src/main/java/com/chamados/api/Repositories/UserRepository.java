package com.chamados.api.Repositories;

import com.chamados.api.DTO.UserDTO;
import com.chamados.api.Entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u FROM User u LEFT JOIN u.department d LEFT JOIN u.cargo c")
    List<User> findAllWithoutPassword();

    default List<UserDTO> findAllUserDTOWithoutPassword() {
        List<User> users = findAllWithoutPassword();
        return users.stream()
                .map(UserDTO::new)
                .toList();
    }

    User findByEmail(String email);
    Boolean existsByEmail(String email);
    void deleteById(Long id);

    Page<User> findAll(Pageable pageable);
}
