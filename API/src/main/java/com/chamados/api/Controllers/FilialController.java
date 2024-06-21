package com.chamados.api.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chamados.api.Entities.Filial;
import com.chamados.api.Repositories.FilialRepository;

@RestController
@RequestMapping("/filial")
public class FilialController {

    @Autowired
    FilialRepository filialRepository;

    @GetMapping
    public List<Filial> listAll(){
        return filialRepository.findAll();
    }

    @PostMapping
    public Filial save(@RequestBody Filial filial){
        return filialRepository.save(filial);
    }

}