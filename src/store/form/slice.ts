import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FormState = {
  lists: Record<string, []>;
  openApi: OpenApi| null;
};

export type OpenApi = {
  paths: Record<string, any>;
  components: {
    schemas: Record<string, any>;
  };
};

const initialState: FormState = {
  lists: {},
  openApi: null,
};

const tabSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    addList: (state, action: PayloadAction<{route: string, list: []}>) => {
      state.lists[action.payload.route] = action.payload.list;
    },
    clearLists: (state) => {
      state.lists = {};
    },
    setOpenApi: (state, action: PayloadAction<OpenApi>) => {
      state.openApi = action.payload;
    },
    clearOpenApi: (state) => {
      state.openApi = null;
    },
  },
});

export const { addList, clearLists, setOpenApi, clearOpenApi } = tabSlice.actions;
export default tabSlice.reducer;