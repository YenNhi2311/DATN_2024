package com.edu.datn.controller;

import com.edu.datn.dto.ColorDTO;
import com.edu.datn.entities.ColorEntity;
import com.edu.datn.service.ColorService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/colors")
public class ColorController {
  @Autowired
  private ColorService colorService;

  @GetMapping
  public ResponseEntity<List<ColorEntity>> getAllColors() {
    List<ColorEntity> colors = colorService.getAllColors();
    return ResponseEntity.ok(colors);
  }

  @PostMapping
  public ResponseEntity<ColorEntity> addColor(@RequestBody ColorDTO colorDto) {
    ColorEntity createdColor = colorService.addColor(colorDto);
    return ResponseEntity.ok(createdColor);
  }

  @PutMapping("/{id}")
  public ResponseEntity<ColorEntity> updateColor(
    @PathVariable Integer id,
    @RequestBody ColorDTO colorDto
  ) {
    try {
      ColorEntity updatedColor = colorService.updateColor(id, colorDto);
      return ResponseEntity.ok(updatedColor); // Trả về 200 OK nếu thành công
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // Trả về 401 nếu gặp lỗi xác thực
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteColor(@PathVariable Integer id) {
    try {
      colorService.deleteColor(id);
      return ResponseEntity.ok().build();
    } catch (Exception e) {
      return ResponseEntity.badRequest().build();
    }
  }
}
