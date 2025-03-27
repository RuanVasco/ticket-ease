package com.ticketease.api.Services;

import com.ticketease.api.DTO.TicketCategoryDTO;
import com.ticketease.api.Entities.Department;
import com.ticketease.api.Entities.TicketCategory;
import com.ticketease.api.Repositories.DepartmentRepository;
import com.ticketease.api.Repositories.TicketCategoryRepository;
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
            TicketCategory category = new TicketCategory();
            category.setName(name);
            category.setReceiveTickets(receiveTickets);
            category.setDepartment(department);
            category.setFather(father);
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

        ticketCategory.setName(ticketCategoryDTO.getName());
        ticketCategory.setReceiveTickets(ticketCategoryDTO.getReceiveTickets());
        ticketCategory.setDepartment(department);
        ticketCategory.setFather(father);
        ticketCategoryRepository.save(ticketCategory);
    }

}
