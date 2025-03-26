package com.chamados.api.DTO.AssemblerDTO;

import com.chamados.api.Controllers.TicketController;
import com.chamados.api.DTO.RoleDepartmentDTO;
import com.chamados.api.DTO.TicketDTO;
import com.chamados.api.DTO.TicketCategoryDTO;
import com.chamados.api.DTO.User.UserDTO;
import com.chamados.api.Entities.Ticket;
import com.chamados.api.Entities.User;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class TicketDTOAssembler implements RepresentationModelAssembler<Ticket, TicketDTO> {

    @Override
    public TicketDTO toModel(Ticket ticket) {
        TicketDTO dto = new TicketDTO();
        dto.setId(ticket.getId());
        dto.setName(ticket.getName());
        dto.setDescription(ticket.getDescription());
        dto.setObservation(ticket.getObservation());
        dto.setStatus(ticket.getStatus());
        dto.setUrgency(ticket.getUrgency());
        dto.setReceiveEmail(ticket.getReceiveEmail());
        dto.setCreatedAt(ticket.getCreatedAt());
        dto.setUpdatedAt(ticket.getUpdatedAt());
        dto.setClosedAt(ticket.getClosedAt());

        if (ticket.getTicketCategory() != null) {
            dto.setTicketCategory(new TicketCategoryDTO(ticket.getTicketCategory()));

            dto.setCategoryPath((ticket.getTicketCategory().getPath()));
        }

        if (ticket.getUser() != null) {
            User user = ticket.getUser();

            List<RoleDepartmentDTO> roleDepartments = user.getRoleBindings().stream()
                    .map(binding -> new RoleDepartmentDTO(
                            binding.getRole(),
                            binding.getDepartment()
                    ))
                    .toList();

            dto.setUser(new UserDTO(
                    user.getName(),
                    user.getPhone(),
                    user.getEmail(),
                    null,
                    user.getCargo() != null ? user.getCargo() : null,
                    roleDepartments
            ));
        }

        Set<UserDTO> observers = ticket.getObservers().stream().map(observer -> {
            List<RoleDepartmentDTO> roleDepartments = observer.getRoleBindings().stream()
                    .map(binding -> new RoleDepartmentDTO(
                            binding.getRole(),
                            binding.getDepartment()
                    ))
                    .toList();

            return new UserDTO(
                    observer.getName(),
                    observer.getPhone(),
                    observer.getEmail(),
                    null,
                    observer.getCargo() != null ? observer.getCargo() : null,
                    roleDepartments
            );
        }).collect(Collectors.toSet());

        dto.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(TicketController.class)
                .getTicketById(ticket.getId())).withSelfRel());

        return dto;
    }
}
