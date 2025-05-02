import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getUsers,
  addUser as apiAddUser,
  updateUser as apiUpdateUser,
  deleteUser as apiDeleteUser,
} from "./userAPI";

//display
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const data = await getUsers();
  return data;
});

//add

export const createUser = createAsyncThunk(
  "users/createUser",
  async (userData) => {
    const data = await apiAddUser(userData);
    return data;
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, userData }) => {
    const data = await apiUpdateUser(id, userData);
    return data;
  }
);

export const deleteUser = createAsyncThunk("users/deleteUser", async (id) => {
  await apiDeleteUser(id);
  return id;
});

const initialState = {
  users: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        console.log("✅ Users loaded");
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      });
  },
});

export default userSlice.reducer;
