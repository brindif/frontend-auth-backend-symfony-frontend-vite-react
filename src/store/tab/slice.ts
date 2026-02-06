import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum PermissionType {
  READ = 'read',
  WRITE = 'write', 
  MANAGE = 'manage'
}

export type Tab = {
  "@id"?: string;
  "@type"?: string;
  id?: string;
  name: string;
  defaultName?: string;
  path: string;
  route: string;
  parent?: string;
  type: string;
  position: number;
  permission: PermissionType;
  permissions: any[];
  children?: Tab[];
};

export type OpenApi = {
  paths: Record<string, any>;
  components: {
    schemas: Record<string, any>;
  };
};

export type FormState = {
  openApi: OpenApi| null;
  tabs: Tab[] | null;
  currentTabs: Tab[];
  tree: any[];
};

const initialState: FormState = {
  openApi: null,
  tabs: null,
  tree: [],
  currentTabs: [],
};

function getChildren(parent: Tab, tabs: Tab[]): Tab[] {
  return tabs
    .filter((tab) => tab.parent === parent['@id'])
    .map((tab) => {
        tab.path = `${parent.path}/${tab.route}`;
        tab.children = getChildren(tab, tabs);
        return tab;
    })
    .sort((a, b) => a.position - b.position);
};

const tabSlice = createSlice({
  name: "tab",
  initialState,
  reducers: {
    setTabs: (state, action: PayloadAction<Tab[]>) => {
      state.tabs = action.payload;
      state.tree = action.payload.filter((tab) => !tab.parent).map((tab) => {
        tab.path = tab.route;
        tab.children = getChildren(tab, action.payload);
        return tab;
      }).sort((a, b) => a.position - b.position);
    },
    clearTabs: (state) => {
      state.tabs = [];
    },
    setCurrentTabs: (state, action: PayloadAction<Tab | null>) => {
      if (!action.payload) {
        state.currentTabs = [];
        return;
      }
      state.currentTabs = [action.payload];
      let parent = action.payload.parent;
      while (parent) {
        const parentTab = state.tabs?.find((tab) => tab['@id'] === parent);
        if (parentTab) {
          state.currentTabs.unshift(parentTab);
          parent = parentTab.parent;
        } else {
          parent = undefined;
        }
      }
    },
    setOpenApi: (state, action: PayloadAction<OpenApi>) => {
      state.openApi = action.payload;
    },
    clearOpenApi: (state) => {
      state.openApi = null;
    },
  },
});

export const { setTabs, clearTabs, setCurrentTabs, setOpenApi, clearOpenApi } = tabSlice.actions;
export default tabSlice.reducer;