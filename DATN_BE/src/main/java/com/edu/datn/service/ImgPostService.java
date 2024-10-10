// package com.edu.datn.service;

// import java.util.ArrayList;

// import org.springframework.web.multipart.MultipartFile;

// public class ImgPostService {
//     public List<String> saveImages(List<MultipartFile> images) throws IOException {
//         List<String> imagePaths = new ArrayList<>();

//         for (MultipartFile image : images) {
//             // Lấy tên file gốc
//             String originalFilename = image.getOriginalFilename();

//             // Tạo một file mới từ đường dẫn và tên file
//             File file = new File(UPLOAD_DIR + originalFilename);

//             // Kiểm tra thư mục lưu trữ
//             if (!file.exists()) {
//                 file.getParentFile().mkdirs(); // Tạo thư mục nếu chưa tồn tại
//             }

//             // Lưu file lên hệ thống
//             image.transferTo(file);

//             // Lưu đường dẫn file vào danh sách
//             imagePaths.add(file.getAbsolutePath());
//         }

//         return imagePaths;
//     }
// }
