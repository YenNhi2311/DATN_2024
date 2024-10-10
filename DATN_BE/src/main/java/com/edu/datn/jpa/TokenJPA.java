package com.edu.datn.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.edu.datn.entities.TokenEntity;

public interface TokenJPA extends JpaRepository<TokenEntity, Integer> {
    @Query("""
            select t from TokenEntity t 
            where t.user.id = :userId and t.loggedOut = false
            """)
    List<TokenEntity> findAllAccessTokensByUser(@Param("userId") Integer userId);

    Optional<TokenEntity> findByAccessToken(String token);

    Optional<TokenEntity> findByRefreshToken(String token);
}
