import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type OpenApiType = {
  paths: Record<string, any>;
  components: {
    schemas: Record<string, any>;
  };
};

export type AdminState = {
  openApi: OpenApiType | null;
};

const initialState: AdminState = {
  openApi: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setOpenApi: (state, action: PayloadAction<OpenApiType>) => {
      state.openApi = action.payload;
    },
    clearOpenApi: (state) => {
      state.openApi = null;
    },
  },
});

export const { setOpenApi, clearOpenApi } = adminSlice.actions;
export default adminSlice.reducer;
