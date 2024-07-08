package com.chamados.api.Controllers;

import com.chamados.api.Repositories.RhTicketFormRepository;
import com.chamados.api.Repositories.TiTicketFormRepository;
import com.chamados.api.Tickets.RhTicketForm;
import com.chamados.api.Tickets.TiTicketForm;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("tickets")
public class TicketController {

    @Autowired
    private TiTicketFormRepository tiTicketFormRepository;

    @Autowired
    private RhTicketFormRepository rhTicketFormRepository;

    @PostMapping("/")
    public ResponseEntity<?> createTicket(@RequestBody Map<String, Object> ticketData) {
        String setorResponsavel = (String) ticketData.get("setor_responsavel");
        
        if (setorResponsavel == null) {
            return ResponseEntity.badRequest().body("setor_responsavel is required");
        }

        switch (setorResponsavel) {
            case "TI":
                TiTicketForm tiTicket = new TiTicketForm();
                tiTicket.setAssunto((String) ticketData.get("assunto"));
                tiTicket.setDescricao((String) ticketData.get("descricao"));
                tiTicket.setTeste((String) ticketData.get("teste"));
                tiTicketFormRepository.save(tiTicket);
                return ResponseEntity.ok(tiTicket);

            case "RH":
                RhTicketForm rhTicket = new RhTicketForm();
                rhTicket.setAssunto((String) ticketData.get("assunto"));
                rhTicket.setDescricao((String) ticketData.get("descricao"));
                rhTicket.setAaaaa((String) ticketData.get("aaaaa"));
                rhTicketFormRepository.save(rhTicket);
                return ResponseEntity.ok(rhTicket);

            default:
                return ResponseEntity.badRequest().body("Invalid setor_responsavel");
        }
    }
}
