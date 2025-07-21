package com.ticketease.api.Services;

import com.ticketease.api.DTO.TicketCategoryDTO;
import com.ticketease.api.Entities.Department;
import com.ticketease.api.Entities.Form;
import com.ticketease.api.Entities.TicketCategory;
import com.ticketease.api.Repositories.DepartmentRepository;
import com.ticketease.api.Repositories.FormRepository;
import com.ticketease.api.Repositories.TicketCategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TicketCategoryService {

	private static final Logger logger = LoggerFactory.getLogger(TicketCategoryService.class);

	@Autowired
	private TicketCategoryRepository ticketCategoryRepository;

	@Autowired
	private DepartmentRepository departmentRepository;

	private final FormRepository formRepository;
	private final FormService formService;

	@Transactional
	public void addCategory(String name, Department department, TicketCategory father) {
		try {
			TicketCategory category = new TicketCategory();
			category.setName(name);
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
			Optional<Department> optionalDepartment = departmentRepository
					.findById(ticketCategoryDTO.getDepartmentId());
			if (optionalDepartment.isPresent()) {
				department = optionalDepartment.get();
			}
		}

		TicketCategory father = null;

		if (ticketCategoryDTO.getFatherId() != null) {
			Optional<TicketCategory> optionalFather = ticketCategoryRepository
					.findById(ticketCategoryDTO.getFatherId());
			father = optionalFather.orElse(null);
		}

		ticketCategory.setName(ticketCategoryDTO.getName());
		ticketCategory.setDepartment(department);
		ticketCategory.setFather(father);
		ticketCategoryRepository.save(ticketCategory);
	}

	public List<TicketCategory> findRootCategories() {
		return ticketCategoryRepository.findAllRoot();
	}

	public List<TicketCategory> findByFather(Long categoryId) {
		return ticketCategoryRepository.findByFather(categoryId);
	}

	public List<TicketCategory> findChildrenWithFormDescendants(Long fatherId) {
		List<TicketCategory> children = (fatherId == null)
				? ticketCategoryRepository.findAllRoot()
				: ticketCategoryRepository.findByFather(fatherId);

		return children.stream().filter(this::hasFormInSubtree).toList();
	}

	private boolean hasFormInSubtree(TicketCategory category) {
		if (!formRepository.findByTicketCategoryId(category.getId()).isEmpty()) {
			return true;
		}

		List<TicketCategory> children = ticketCategoryRepository.findByFather(category.getId());
		for (TicketCategory child : children) {
			if (hasFormInSubtree(child)) {
				return true;
			}
		}

		return false;
	}

	public void delete(TicketCategory ticketCategory) {
		TicketCategory parent = ticketCategory.getFather();

		for (Form child : ticketCategory.getForms()) {
			child.setTicketCategory(parent);
			formService.save(child);
		}

		ticketCategoryRepository.delete(ticketCategory);
	}

	public List<TicketCategoryDTO> getCategoryPath(Long categoryId) {
		List<TicketCategoryDTO> path = new ArrayList<>();
		TicketCategory current = ticketCategoryRepository.findById(categoryId)
				.orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada"));

		while (current != null) {
			path.addFirst(new TicketCategoryDTO(current));
			current = current.getFather();
		}

		return path;
	}
}
