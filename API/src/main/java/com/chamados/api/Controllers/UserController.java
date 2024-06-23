package com.chamados.api.Controllers;

import java.security.NoSuchAlgorithmException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.chamados.api.Entities.User;
import com.chamados.api.Repositories.UserRepository;
import com.chamados.api.Services.UserService;


import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserRepository userRepository;
    
    @Autowired
    UserService userService;

    @GetMapping
    public List<User> listAll(){
        return userRepository.findAll();
    }

    @PostMapping
    public User save(@RequestBody User usuario){
        return this.userService.save(usuario);
    }
    
    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<?> login(@RequestBody User user, HttpSession session) throws NoSuchAlgorithmException {
        try {
            User userLogin = userService.loginUser(user.getEmail(), user.getPassword());
            
            if (userLogin != null) {
                session.setAttribute("loggedInUser", userLogin);
                return ResponseEntity.ok(userLogin);
            } else {
                return ResponseEntity.status(401).body("E-mail ou senha inválidos");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao realizar login: " + e.getMessage());
        }
    }
}