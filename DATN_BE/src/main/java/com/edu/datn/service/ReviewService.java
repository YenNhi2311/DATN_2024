package com.edu.datn.service;

import com.edu.datn.dto.ReviewDTO;
import com.edu.datn.entities.ReviewEntity;
import com.edu.datn.jpa.ReviewJPA;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewJPA reviewRepository;

    public List<ReviewDTO> getAllReviews() {
        return reviewRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ReviewDTO getReviewById(Integer id) {
        return toDTO(reviewRepository.findById(id).orElseThrow(() -> new RuntimeException("Review not found")));
    }

    public ReviewDTO createReview(ReviewDTO reviewDto) throws IOException {
        ReviewEntity entity = toEntity(reviewDto);
        ReviewEntity savedEntity = reviewRepository.save(entity);
        return toDTO(savedEntity);
    }

    public ReviewDTO updateReview(Integer id, ReviewDTO reviewDto) throws IOException {
        ReviewEntity entity = reviewRepository.findById(id).orElseThrow(() -> new RuntimeException("Review not found"));
        entity.setComment(reviewDto.getComment());
        entity.setStar(reviewDto.getStar());
        // Set các thuộc tính khác nếu cần
        ReviewEntity updatedEntity = reviewRepository.save(entity);
        return toDTO(updatedEntity);
    }

    public void deleteReview(Integer id) {
        reviewRepository.deleteById(id);
    }

    private ReviewDTO toDTO(ReviewEntity entity) {
        return new ReviewDTO(
                entity.getReviewId(),
                entity.getComment(),
                entity.getStar(),
                entity.getProduct().getProductId(),
                entity.getUser().getUserId()
        );
    }

    private ReviewEntity toEntity(ReviewDTO reviewDto) {
        ReviewEntity entity = new ReviewEntity();
        entity.setReviewId(reviewDto.getReviewId());
        // Set các thuộc tính khác nếu cần
        return entity;
    }
}
