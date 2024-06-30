package com.chamados.api.Controllers;

import jakarta.persistence.MappedSuperclass;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.Metamodel;
import jakarta.persistence.metamodel.SingularAttribute;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/forms")
public class FormController {

    @Autowired
    private EntityManagerFactory entityManagerFactory;

    @GetMapping("/{entityName}")
    public List<String> getEntityFields(@PathVariable String entityName) {
        List<String> fields = new ArrayList<>();

        try (EntityManager entityManager = entityManagerFactory.createEntityManager()) {
            Metamodel metamodel = entityManager.getMetamodel();

            for (EntityType<?> entityType : metamodel.getEntities()) {
                Class<?> javaType = entityType.getJavaType();
                if (isEntityMatch(javaType, entityName)) {
                    collectAttributes(fields, javaType);
                    break;
                }
            }
        }

        if (fields.isEmpty() || entityName.isEmpty()) {
            fields.add("empty");
        }

        return fields;
    }

    private boolean isEntityMatch(Class<?> javaType, String entityName) {
        String tableTicketName = javaType.getSimpleName();

        if (tableTicketName.endsWith("TicketForm")) {
            return tableTicketName.equalsIgnoreCase(entityName);
        }

        return false;
    }

    private void collectAttributes(List<String> fields, Class<?> javaType) {
        collectAttributesRecursively(fields, javaType);
    }

    private void collectAttributesRecursively(List<String> fields, Class<?> javaType) {
        for (Field field : javaType.getDeclaredFields()) {
            if (field.getName().equals("assunto")) {
                fields.addFirst(field.getName() + " (" + field.getType().getSimpleName() + ")");
            } else if (field.getName().equals("descricao")) {
                fields.add(1, field.getName() + " (" + field.getType().getSimpleName() + ")");
            } else {
                fields.add(field.getName() + " (" + field.getType().getSimpleName() + ")");
            }
        }

        // Check for superclasses and collect their attributes recursively
        Class<?> superclass = javaType.getSuperclass();
        if (superclass != null && superclass.isAnnotationPresent(MappedSuperclass.class)) {
            collectAttributesRecursively(fields, superclass);
        }
    }
}
