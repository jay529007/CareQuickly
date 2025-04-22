import { configureStore } from "@reduxjs/toolkit";
import doctorReducer from "../functions/doctorSlice";
import userReducer from "../functions/userSlice";

export const store = configureStore({
  reducer: {
    doctors: doctorReducer,
    users: userReducer,
  },
});
