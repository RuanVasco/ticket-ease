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

        if (fields.isEmpty()) {
            return null; // Return null or handle appropriately if no fields found
        }

        return fields;
    }

    private boolean isEntityMatch(Class<?> javaType, String entityName) {
        String tableName = javaType.getSimpleName();
        return tableName.equalsIgnoreCase(entityName.trim()); // Adjust for case and trim spaces
    }

    private void collectAttributes(List<String> fields, Class<?> javaType) {
        collectAttributesRecursively(fields, javaType);
    }

    private void collectAttributesRecursively(List<String> fields, Class<?> javaType) {
        for (Field field : javaType.getDeclaredFields()) {
            fields.add(field.getName() + " (" + field.getType().getSimpleName() + ")");
        }

        // Check for superclasses and collect their attributes recursively
        Class<?> superclass = javaType.getSuperclass();
        if (superclass != null && superclass.isAnnotationPresent(MappedSuperclass.class)) {
            collectAttributesRecursively(fields, superclass);
        }
    }
}
