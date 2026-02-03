import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FormState = {
  lists: Record<string, []>;
};

const initialState: FormState = {
  lists: {},
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
  },
});

export const { addList, clearLists } = tabSlice.actions;
export default tabSlice.reducer;