import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/slice";
import tabReducer from "./tab/slice";
import formReducer from "./form/slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tab: tabReducer,
    form: formReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
