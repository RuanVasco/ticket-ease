package com.chamados.api.Services;

import com.chamados.api.DTO.TicketCategoryDTO;
import com.chamados.api.Entities.Department;
import com.chamados.api.Entities.TicketCategory;
import com.chamados.api.Repositories.DepartmentRepository;
import com.chamados.api.Repositories.TicketCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;

@Service
public class TicketCategoryService {

    private static final Logger logger = LoggerFactory.getLogger(TicketCategoryService.class);

    @Autowired
    private TicketCategoryRepository ticketCategoryRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Transactional
    public void addCategory(String name, Boolean receiveTickets, Department department, TicketCategory father) {
        try {
            String path = buildPath(father, department, name);
            TicketCategory category = new TicketCategory();
            category.setName(name);
            category.setReceiveTickets(receiveTickets);
            category.setDepartment(department);
            category.setFather(father);
            category.setPath(path);
            ticketCategoryRepository.save(category);
        } catch (Exception e) {
            logger.error("Error adding category", e);
        }
    }

    @Transactional
    public void updateCategory(TicketCategory ticketCategory, TicketCategoryDTO ticketCategoryDTO) {
        Department department = null;

        if (ticketCategoryDTO.getDepartmentId() != null) {
            Optional<Department> optionalDepartment = departmentRepository.findById(ticketCategoryDTO.getDepartmentId());
            if (optionalDepartment.isPresent()) {
                department = optionalDepartment.get();
            }
        }

        TicketCategory father = null;

        if (ticketCategoryDTO.getFatherId() != null) {
            Optional<TicketCategory> optionalFather = ticketCategoryRepository.findById(ticketCategoryDTO.getFatherId());
            father = optionalFather.orElse(null);
        }

        String path = buildPath(father, department, ticketCategoryDTO.getName());

        ticketCategory.setName(ticketCategoryDTO.getName());
        ticketCategory.setReceiveTickets(ticketCategoryDTO.getReceiveTickets());
        ticketCategory.setDepartment(department);
        ticketCategory.setFather(father);
        ticketCategory.setPath(path);
        ticketCategoryRepository.save(ticketCategory);
    }

    private String buildPath(TicketCategory father, Department department, String name) {
        StringBuilder pathBuilder = new StringBuilder();

        TicketCategory current = father;

        if (current != null) {
            Department temp = current.getDepartment();
            while (current != null) {
                pathBuilder.insert(0, current.getName());
                if (current.getFather() != null) {
                    pathBuilder.insert(0, " > ");
                }
                temp = current.getDepartment();
                current = current.getFather();
            }

            pathBuilder.insert(0, temp.getName() + " > ");
        } else {
            pathBuilder.insert(0, department.getName());
        }

        pathBuilder.append(" > ").append(name);

        return pathBuilder.toString();
    }

}
