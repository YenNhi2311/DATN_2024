import React, { useEffect, useState } from "react";
import { apiClient } from "../../config/apiClient";

const LikeButton = ({ postId, userId }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchLikesData = async () => {
      try {
        // Kiểm tra trạng thái like
        const isLikedResponse = await apiClient.get(`/api/post/isLiked`, {
          params: { postId, userId },
        });
        setIsLiked(isLikedResponse.data);

        // Lấy số lượng like
        const likesResponse = await apiClient.get(
          `/api/post/${postId}/likes/count`
        );
        setLikesCount(likesResponse.data);
      } catch (error) {
        console.error("Error fetching like data: ", error);
      }
    };

    fetchLikesData();
  }, [postId, userId]);

  const handleLikeToggle = () => {
    if (isLiked) {
      apiClient
        .post(`/api/post/unlike`, null, { params: { postId, userId } })
        .then(() => {
          setIsLiked(false);
          setLikesCount((prevLikes) => prevLikes - 1);
        })
        .catch((error) => console.error(error));
    } else {
      apiClient
        .post(`/api/post/like`, null, { params: { postId, userId } })
        .then(() => {
          setIsLiked(true);
          setLikesCount((prevLikes) => prevLikes + 1);
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <div className="like-button">
      <button
        onClick={handleLikeToggle}
        style={{
          color: isLiked ? "blue" : "gray",
          background: "white",
          border: "none",
        }}
      >
        {isLiked ? (
          <i className="fa fa-thumbs-up" title="Unlike"></i>
        ) : (
          <i className="fa fa-thumbs-up" title="Unlike"></i>
        )}
      </button>
      <span>
        {likesCount} {likesCount <= 1 ? "like" : "likes"}
      </span>
    </div>
  );
};

export default LikeButton;
