// 模拟登录 API
export const login = async (username, password) => {
  // 这里应该替换为实际的 API 调用
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === "admin" && password === "admin123") {
        resolve({
          token: "dummy-token",
          user: {
            id: 1,
            username: "admin",
            name: "管理员",
          },
        });
      } else {
        reject(new Error("用户名或密码错误"));
      }
    }, 1000);
  });
};

// 退出登录
export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
