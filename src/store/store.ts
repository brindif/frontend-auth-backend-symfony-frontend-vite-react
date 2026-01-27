import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/slice";
import formReducer from "./form/slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    form: formReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
