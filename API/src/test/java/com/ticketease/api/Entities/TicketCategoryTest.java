package com.ticketease.api.Entities;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.Test;

public class TicketCategoryTest {
  @Test
  void testGetDepartment_whenOwnDepartmentIsSet() {
    Department department = new Department();
    department.setName("TI");

    TicketCategory category = new TicketCategory();
    category.setName("Hardware");
    category.setDepartment(department);

    assertEquals(department, category.getDepartment());
  }

  @Test
  void testGetDepartment_whenDepartmentIsInheritedFromFather() {
    Department department = new Department();
    department.setName("RH");

    TicketCategory parent = new TicketCategory();
    parent.setName("Categoria Pai");
    parent.setDepartment(department);

    TicketCategory child = new TicketCategory();
    child.setName("Categoria Filha");
    child.setFather(parent);

    assertEquals(department, child.getDepartment());
  }

  @Test
  void testGetDepartment_whenNoDepartmentAnywhere() {
    TicketCategory orphan = new TicketCategory();
    orphan.setName("Orfã");

    TicketCategory child = new TicketCategory();
    child.setName("Filha da orfã");
    child.setFather(orphan);

    assertNull(child.getDepartment());
  }

  @Test
  void testGetDepartment_withMultipleFathersUntilFound() {
    Department department = new Department();
    department.setName("Financeiro");

    TicketCategory top = new TicketCategory();
    top.setName("Top");
    top.setDepartment(department);

    TicketCategory mid = new TicketCategory();
    mid.setName("Médio");
    mid.setFather(top);

    TicketCategory bottom = new TicketCategory();
    bottom.setName("Inferior");
    bottom.setFather(mid);

    assertEquals(department, bottom.getDepartment());
  }
}
