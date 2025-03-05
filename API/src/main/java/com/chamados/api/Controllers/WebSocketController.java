package com.chamados.api.Controllers;

import com.chamados.api.Entities.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {
    @MessageMapping("/hello")
    @SendTo
    public String greeting(String message) {
        System.out.println(message);

        return "Olá, " + message + "!";
    }

    @MessageMapping("/chat")
    @SendTo("/topic/chat")
    public Message chat(Message chatMessage) {
        System.out.println("Mensagem de chat recebida: " + chatMessage.getText());
        return chatMessage;
    }
}
