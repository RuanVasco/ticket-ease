package com.chamados.api.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chamados.api.Entities.User;
import com.chamados.api.Repositories.UserRepository;
import com.chamados.api.Services.UserService;

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

}