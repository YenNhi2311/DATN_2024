import CryptoJS from "crypto-js";
import React, { useEffect, useState } from "react";
import "../../assets/css/postdetail.css";
import { apiClient } from "../../config/apiClient";
import PostItem from "../user/PostItem";

const PostDetail = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const encryptedUserData = localStorage.getItem("userData");

    if (encryptedUserData) {
      try {
        const decryptedUserData = CryptoJS.AES.decrypt(
          encryptedUserData,
          "secret-key"
        ).toString(CryptoJS.enc.Utf8);
        const parsedUserData = JSON.parse(decryptedUserData);
        setUserId(parsedUserData?.user_id);
      } catch (error) {
        console.error("Lỗi giải mã userId:", error);
      }
    }

    apiClient
      .get("/api/post/all")
      .then((response) => {
        const sortedPosts = response.data.sort(
          (a, b) => new Date(b.createAt) - new Date(a.createAt)
        );

        const updatedPosts = sortedPosts.map((post) => ({
          ...post,
          isLiked: post.isLikedByCurrentUser || false,
          totalLikes: post.likesCount || 0,
        }));

        setPosts(updatedPosts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu bài đăng:", error);
        setLoading(false);
      });
  }, []);

  const handleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.postId === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              totalLikes: post.isLiked
                ? post.totalLikes - 1
                : post.totalLikes + 1,
            }
          : post
      )
    );

    // Gọi API để like/unlike
    const likedPost = posts.find((post) => post.postId === postId);
    apiClient
      .post(`/api/post/${likedPost.isLiked ? "unlike" : "like"}`, null, {
        params: { postId, userId },
      })
      .catch((error) => console.error("Lỗi khi like/unlike bài đăng:", error));
  };

  return (
    <div className="post-details">
      {loading ? (
        <div>Loading posts...</div>
      ) : (
        posts.map((post) => (
          <div key={post.postId}>
            <PostItem
              post={post}
              userId={userId}
              handleLike={() => handleLike(post.postId)}
            />
            {/* Thêm phần CommentSection ở dưới mỗi bài đăng */}
          </div>
        ))
      )}
    </div>
  );
};

export default PostDetail;
