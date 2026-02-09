import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { formatList } from "../../utils/form/formatList";

export type FormState = {
  lists: Record<string, any[]>;
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
    addList: (state, action: PayloadAction<{route: string, list: any[]}>) => {
      state.lists[action.payload.route] = formatList(action.payload.route, action.payload.list);
    },
    clearList: (state, action: PayloadAction<string>) => {
      if (!action.payload || typeof action.payload !== 'string' || !state.lists[action.payload]) return;
      delete state.lists[action.payload];
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

export const { addList, clearLists, clearList, setOpenApi, clearOpenApi } = tabSlice.actions;
export default tabSlice.reducer;