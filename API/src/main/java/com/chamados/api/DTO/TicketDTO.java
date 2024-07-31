package com.chamados.api.DTO;

import java.awt.*;

public record TicketDTO(String name, String description, String observation, String procedure, String status, String urgency, Boolean receiveEmail) {
}
