package com.ticketease.api.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.Setter;

@Getter
@Entity
@Table(name = "departments")
public class Department {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Setter private String name;

  @Setter private boolean receivesRequests;

  @ManyToOne
  @JoinColumn(name = "unit_id")
  @Setter
  private Unit unit;

  @Getter
  @OneToMany(mappedBy = "department", fetch = FetchType.EAGER)
  @JsonManagedReference
  @JsonIgnore
  private Set<UserRoleDepartment> roleBindings = new HashSet<>();

  public Department() {}

  public Department(String name, boolean receivesRequests, Unit unit) {
    this.name = name;
    this.receivesRequests = receivesRequests;
    this.unit = unit;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Department that = (Department) o;
    return Objects.equals(id, that.id);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id);
  }

  public Set<User> getUsers() {
    return roleBindings.stream().map(UserRoleDepartment::getUser).collect(Collectors.toSet());
  }
}
