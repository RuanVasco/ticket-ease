package com.chamados.api.Services;

import com.chamados.api.Entities.Department;
import com.chamados.api.Entities.TicketCategory;
import com.chamados.api.Repositories.TicketCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class TicketCategoryService {

    private static final Logger logger = LoggerFactory.getLogger(TicketCategoryService.class);

    @Autowired
    private TicketCategoryRepository ticketCategoryRepository;

    @Transactional
    public void addCategory(String name, Department department, TicketCategory father) {
        try {
            String path = buildPath(father, department);
            TicketCategory category = new TicketCategory();
            category.setName(name);
            category.setDepartment(department);
            category.setFather(father);
            category.setPath(path);
            ticketCategoryRepository.save(category);
        } catch (Exception e) {
            logger.error("Error adding category", e);
        }
    }

    private String buildPath(TicketCategory father, Department department) {
        StringBuilder pathBuilder = new StringBuilder();

        if (department != null) {
            pathBuilder.append(department.getName());
            if (father != null) {
                pathBuilder.append(" > ");
            }
        }

        TicketCategory current = father;
        while (current != null) {
            if (!pathBuilder.isEmpty()) {
                pathBuilder.append(" > ");
            }
            pathBuilder.append(current.getName());
            current = current.getFather();
        }

        return pathBuilder.toString();
    }
}
