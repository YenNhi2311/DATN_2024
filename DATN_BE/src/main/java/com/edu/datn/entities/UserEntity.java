package com.edu.datn.entities;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserEntity implements UserDetails { // Implement UserDetails
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "user_id")
  private Integer userId;

  @Column(name = "username", unique = true)
  private String username;

  @Column(name = "password")
  private String password;

  @Column(name = "fullname")
  private String fullname;

  @Column(name = "email")
  private String email;

  @Column(name = "phone")
  private String phone;

  @Column(name = "img")
  private String img;

  @OneToMany(mappedBy = "user")
  @JsonIgnore
  private Set<AddressEntity> addresses;

  @OneToMany(mappedBy = "user")
  @JsonIgnore
  private Set<OrderEntity> orders;

  @OneToMany(mappedBy = "user")
  @JsonIgnore
  private Set<CommentEntity> comments;

  @OneToMany(mappedBy = "user")
  @JsonIgnore
  private Set<LikeEntity> likes;

  @OneToMany(mappedBy = "user")
  @JsonIgnore
  private Set<FriendEntity> friends;

  @OneToMany(mappedBy = "user")
  @JsonIgnore
  private Set<PostEntity> posts;

  @OneToMany(mappedBy = "user")
  @JsonIgnore
  private Set<ReviewEntity> reviews;

  @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
  @JsonIgnore
  private Set<UserRoleEntity> userRoles;

  @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
  @JsonIgnore
  private CartEntity cart;

  @OneToMany(mappedBy = "user")
  @JsonIgnore
  private List<TokenEntity> tokens;

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return userRoles
      .stream()
      .map(userRole -> new SimpleGrantedAuthority(userRole.getRole().getName()))
      .collect(Collectors.toList());
  }

  @Override
  public String getPassword() {
    return password;
  }

  @Override
  public String getUsername() {
    return username;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }
}
