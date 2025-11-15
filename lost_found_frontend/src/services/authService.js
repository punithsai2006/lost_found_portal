import api from "./api";

// ------------------------------------
// LOGIN USER (roll_number + password)
// ------------------------------------
export const loginUser = async (roll_number, password) => {
  const formData = new FormData();
  formData.append("username", roll_number);  // OAuth2 expects "username"
  formData.append("password", password);

  const response = await api.post("/auth/login", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data; // Contains access_token
};

// ------------------------------------
// GET CURRENT LOGGED-IN USER
// ------------------------------------
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

// ------------------------------------
// REGISTER USER
// ------------------------------------
export const registerUser = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

// ------------------------------------
// LOGOUT
// ------------------------------------
export const logoutUser = () => {
  localStorage.removeItem("token");
};
