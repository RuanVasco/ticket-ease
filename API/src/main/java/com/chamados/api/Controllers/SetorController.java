package com.chamados.api.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chamados.api.Entities.Setor;
import com.chamados.api.Repositories.SetorRepository;

@RestController
@RequestMapping("/setor")
public class SetorController {

    @Autowired
    SetorRepository setorRepository;

    @GetMapping
    public List<Setor> listAll(){
        return setorRepository.findAll();
    }

    @PostMapping
    public Setor save(@RequestBody Setor setor){
        return setorRepository.save(setor);
    }

}