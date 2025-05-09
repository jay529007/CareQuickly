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

export const addDoctor = async (doctorData) => {
  try {
    const res = await api.post("/doctors", doctorData);
    console.log("Doctor Added");
    return res.data;
  } catch (error) {
    console.error("Error adding Doctor", error);
    throw error;
  }
};

export const updateDoctorSlot = async (doctorId, updatedData) => {
  try {
    const res = await api.put(`/doctors/${doctorId}`, updatedData);
    return res.data;
  } catch (error) {
    console.error("Error updating slot", error);
    throw error;
  }
};

export const deleteDoctor = async (id) => {
  try {
    await api.delete(`/doctors/${id}`);
  } catch (error) {
    console.error("Error in Deleting Doctor", error);
    throw error;
  }
};
