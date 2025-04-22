import api from "./api";

export const getDoctor = async () => {
  try {
    const res = await api.get("/doctors");
    return res.data;
  } catch (error) {
    console.error("Error fetching users", error);
    throw error;
  }
};
