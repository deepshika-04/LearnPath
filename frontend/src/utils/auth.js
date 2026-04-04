export const authUtils = {
  setToken: (token) => localStorage.setItem("token", token),
  getToken: () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    if (authUtils.isTokenExpired(token)) {
      authUtils.logout();
      return null;
    }

    return token;
  },
  removeToken: () => localStorage.removeItem("token"),

  setUser: (user) => localStorage.setItem("user", JSON.stringify(user)),
  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
  removeUser: () => localStorage.removeItem("user"),

  isTokenExpired: (token) => {
    try {
      const payloadPart = token.split(".")[1];
      if (!payloadPart) return true;

      const payload = JSON.parse(atob(payloadPart));
      if (!payload.exp) return false;

      const currentTimeSeconds = Math.floor(Date.now() / 1000);
      return payload.exp <= currentTimeSeconds;
    } catch (error) {
      return true;
    }
  },

  isAuthenticated: () => !!authUtils.getToken(),

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};
