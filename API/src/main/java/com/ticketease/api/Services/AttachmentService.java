package com.ticketease.api.Services;

import com.ticketease.api.DTO.FormDTO.FormFieldFileAnswerDTO;
import com.ticketease.api.Entities.*;
import com.ticketease.api.Enums.FieldTypeEnum;
import com.ticketease.api.Repositories.AttachmentRepository;
import com.ticketease.api.Repositories.TicketResponseRepository;
import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AttachmentService {
	private final AttachmentRepository attachmentRepository;
	private final TicketResponseRepository ticketResponseRepository;

	@Value("${upload.path}")
	private String uploadPath;

	@PostConstruct
	public void init() {
		File dir = new File(uploadPath).getAbsoluteFile();
		if (!dir.exists() && !dir.mkdirs()) {
			throw new IllegalStateException("Não foi possível criar a pasta de uploads: " + dir.getAbsolutePath());
		}
		uploadPath = dir.getAbsolutePath();
	}

	public void saveAttachments(FormFieldFileAnswerDTO fileAnswers, Ticket ticket) {
		File ticketDir = new File(uploadPath, String.valueOf(ticket.getId()));
		if (!ticketDir.exists() && !ticketDir.mkdirs()) {
			throw new IllegalStateException(
					"Não foi possível criar o diretório do ticket: " + ticketDir.getAbsolutePath());
		}

		Form form = ticket.getForm();

		FormField field = form.getFields().stream().filter(f -> f.getId().equals(fileAnswers.getFieldId())).findFirst()
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
						"Campo não encontrado no formulário"));

		for (MultipartFile file : fileAnswers.getFiles()) {
			String contentType = file.getContentType();
			String extension = contentType != null && contentType.contains("/")
					? contentType.substring(contentType.lastIndexOf('/') + 1)
					: "bin";

			String fileName = UUID.randomUUID() + "." + extension;
			String filePath = ticketDir + File.separator + fileName;

			try {
				file.transferTo(new File(filePath));

				TicketResponse ticketResponse = new TicketResponse();
				ticketResponse.setTicket(ticket);
				ticketResponse.setField(field);
				ticketResponse.setValue(fileName);

				Attachment attachment = new Attachment();
				attachment.setFileName(fileName);
				attachment.setFileType(file.getContentType());
				attachment.setFilePath(filePath);
				attachment.setUploadedAt(new Date());
				attachment.setTicketResponse(ticketResponse);

				ticketResponse.setAttachments(List.of(attachment));

				ticketResponseRepository.save(ticketResponse);

			} catch (IOException e) {
				throw new RuntimeException("Erro ao salvar arquivo: " + file.getOriginalFilename(), e);
			}
		}
	}

	public Resource getAttachmentsByTicket(Ticket ticket, String attachmentName) {
		Set<TicketResponse> ticketResponses = ticketResponseRepository.findByTicket(ticket);

		for (TicketResponse tr : ticketResponses) {
			if (tr.getField().getType() == FieldTypeEnum.FILE
					|| tr.getField().getType() == FieldTypeEnum.FILE_MULTIPLE) {
				List<Attachment> attachments = tr.getAttachments();
				for (Attachment attachment : attachments) {
					if (attachment.getFileName().equals(attachmentName)) {
						try {
							Path filePath = Paths.get(attachment.getFilePath());
							Resource resource = new UrlResource(filePath.toUri());
							if (resource.exists() && resource.isReadable()) {
								return resource;
							}
						} catch (MalformedURLException e) {
							throw new RuntimeException("Erro ao carregar o arquivo: " + attachment.getFileName(), e);
						}
					}
				}
			}
		}
		throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nenhum anexo encontrado para este ticket.");
	}
}
