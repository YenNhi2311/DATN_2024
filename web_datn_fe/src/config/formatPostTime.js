export const formatPostTime = (postDate) => {
  const postTime = new Date(postDate);
  const currentTime = new Date();
  const timeDifference = (currentTime - postTime) / 1000; // tính bằng giây

  if (timeDifference < 60) {
    return "Vừa đăng";
  } else if (timeDifference < 3600) {
    const minutes = Math.floor(timeDifference / 60);
    return `${minutes} phút trước`;
  } else if (timeDifference < 86400) {
    const hours = Math.floor(timeDifference / 3600);
    return `${hours} giờ trước`;
  } else {
    return postTime.toLocaleDateString(); // Hiển thị theo định dạng ngày
  }
};

export const formatNotificationTime = (postDate) => {
  const postTime = new Date(postDate);
  const currentTime = new Date();
  const timeDifference = (currentTime - postTime) / 1000; // tính bằng giây

  if (timeDifference < 60) {
    return "Mới đây";
  } else if (timeDifference < 3600) {
    const minutes = Math.floor(timeDifference / 60);
    return `${minutes} phút trước`;
  } else if (timeDifference < 86400) {
    const hours = Math.floor(timeDifference / 3600);
    return `${hours} giờ trước`;
  } else {
    return postTime.toLocaleDateString(); // Hiển thị theo định dạng ngày
  }
};