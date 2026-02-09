import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";

export enum PermissionType {
  READ = 'read',
  WRITE = 'write', 
  MANAGE = 'manage'
}

export type Tab = {
  "@id": string;
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

export type FormState = {
  currentTabs: string[];
  openTabs: string[];
  tabs: Record<string, Tab> | null;
};

const initialState: FormState = {
  tabs: null,
  currentTabs: [],
  openTabs: [],
};

const getTabs = (tabs: Tab[], path: string, parent: string|undefined): Record<string, Tab> => {
  return tabs.filter((tab) => tab.parent === parent)
    .reduce((acc: Record<string, any>, tab: Tab) => ({
      ...acc,
      [tab['@id']]: {
        ...tab,
        path: `${path}/${tab.route}`,
        children: getTabs(tabs, `${path}/${tab.route}`, tab['@id']),
      },
    }), {});
};

const getCurrentsRec = (tabs:Record<string, any>, id:string): string[]|undefined => {
  if(tabs[id])
    return [id];
  else if (Object.keys(tabs).length)
    for(let [childId, childTab] of Object.entries(tabs)) {
      const currents = getCurrentsRec(childTab.children, id);
      if (currents && currents.length) {
        return [childId, ...currents];
      }
    }
  else
    return [];
}

const tabSlice = createSlice({
  name: "tab",
  initialState,
  reducers: {
    setTabs: (state, action: PayloadAction<Tab[]>) => {
      state.tabs = getTabs(action.payload, '', undefined);
    },
    clearTabs: (state) => {
      state.tabs = null;
      state.currentTabs = [];
      state.openTabs = [];
    },
    setCurrentTabs: (state, action: PayloadAction<Tab|null|string>) => {
      if (state.tabs && action.payload && typeof action.payload === 'object' && action.payload['@id']) {
        state.currentTabs = getCurrentsRec(state.tabs, action.payload['@id']) ?? [];
      } else if (action.payload && typeof action.payload === 'string') {
        state.currentTabs = [action.payload];
      } else {
        state.currentTabs = [];
      }
    },
    setOpenTabs: (state, action: PayloadAction<null|string[]>) => {
      state.openTabs = action.payload ?? [];
    },
  },
});

export const { setTabs, clearTabs, setCurrentTabs, setOpenTabs } = tabSlice.actions;
export default tabSlice.reducer;