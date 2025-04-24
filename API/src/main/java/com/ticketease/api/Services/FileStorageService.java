package com.ticketease.api.Services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

  private final Path rootLocation = Paths.get("uploads");

  public void init() {
    try {
      Files.createDirectories(rootLocation);
    } catch (IOException e) {
      throw new RuntimeException("Could not initialize storage", e);
    }
  }

  public void save(MultipartFile file) {
    try {
      Files.copy(file.getInputStream(), this.rootLocation.resolve(file.getOriginalFilename()));
    } catch (Exception e) {
      throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
    }
  }

  public String store(MultipartFile file) {
    try {
      String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
      Files.copy(file.getInputStream(), this.rootLocation.resolve(filename));
      return filename;
    } catch (Exception e) {
      throw new RuntimeException("Failed to store file " + file.getOriginalFilename(), e);
    }
  }
}
