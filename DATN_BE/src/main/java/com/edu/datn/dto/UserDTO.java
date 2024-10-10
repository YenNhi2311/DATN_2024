package com.edu.datn.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class UserDTO {
    private Integer userId;
    private String username;
    private String password;
    private String fullname;
    private String email;
    private String phone;
    private String img;
    // private Set<AddressDto> addresses;
    // private Set<OrderDto> orders;
    // private Set<CommentDto> comments;
    // private Set<LikeDto> likes;
    // private Set<FriendDto> friends;
    // private Set<PostDto> posts;
    // private Set<ReviewDto> reviews;
    // private Set<UserRoleDto> userRoles;
    // private CartDto cart;
}
