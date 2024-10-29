package com.edu.datn.utils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class ImageUtils {
  private static final String UPLOAD_DIR =
    "D:\\FPOLY\\DATN\\FileDATN\\DATN_2024-master\\DATN_BE\\src\\main\\resources\\static\\assets\\img\\";

  static {
    File uploadDir = new File(UPLOAD_DIR);
    if (!uploadDir.exists()) {
      uploadDir.mkdirs();
    }
  }

  public static String saveImage(MultipartFile file) throws IOException {
    if (file.isEmpty()) {
      throw new IOException("Cannot store empty file.");
    }

    // Generate a unique filename using UUID and the original file extension
    String originalFilename = file.getOriginalFilename();
    String fileExtension = originalFilename != null &&
      originalFilename.contains(".")
      ? originalFilename.substring(originalFilename.lastIndexOf("."))
      : "";
    String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

    // Save the file with the unique filename
    Path path = Paths.get(UPLOAD_DIR + uniqueFilename);
    Files.write(path, file.getBytes());

    return uniqueFilename; // Return the unique filename to store in the database
  }

  public static void deleteImage(String imagePath) throws IOException {
    Path path = Paths.get(UPLOAD_DIR + imagePath);
    if (Files.exists(path)) {
      Files.delete(path);
    } else {
      throw new IOException("File not found: " + imagePath);
    }
  }
}
