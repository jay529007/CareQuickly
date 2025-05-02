import api from "./api";

export const getUsers = async () => {
  try {
    const res = await api.get("/users");
    return res.data;
  } catch (error) {
    console.error("Error fetching users", error);
    throw error;
  }
};

export const addUser = async (userData) => {
  try {
    const res = await api.post("/users", userData);
    console.log("added");
    return res.data;
  } catch (error) {
    console.error("Error adding users", error);
    throw error;
  }
};

export const updateUser = async (id, updatedData) => {
  try {
    const res = await api.put(`/users/${id}`, updatedData);
    return res.data;
  } catch (error) {
    console.error("Error updating users", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    await api.delete(`/users/${id}`);
  } catch (error) {
    console.error("Error deleting users", error);
    throw error;
  }
};
