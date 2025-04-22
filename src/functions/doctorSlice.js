import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDoctor } from "./doctorAPI";

//DISPLAY
export const fetchDoctor = createAsyncThunk("doctors/fetchDoctor", async () => {
  const data = await getDoctor();
  return data;
});

const initialState = {
  doctors: [],
  loading: false,
  error: null,
};

const doctorSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchDoctor.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default doctorSlice.reducer;
