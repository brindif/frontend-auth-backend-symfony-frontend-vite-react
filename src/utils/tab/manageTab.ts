export const getTab = (tabs:Record<string, any>|null, id:string|undefined): any|null => {
  if(id && tabs && tabs[id])
    return tabs[id];
  else if (id && tabs && Object.keys(tabs).length)
    for(let childTab of Object.values(tabs)) {
      let result = getTab(childTab.children, id);
      if (result) {
        return result;
      }
    }
  else
    return null;
};

export const getTabFromRoute = (tabs:Record<string, any>|null, route: string): any|null => {
  if (!tabs || !Object.keys(tabs).length)
    return null;
  for(let tab of Object.values(tabs)) {
    if(tab.path === route)
      return tab;
    else if (tab.children && Object.keys(tab.children).length) {
      let childTab = getTabFromRoute(tab.children, route);
      if(childTab) {
        return childTab;
      }
    }
  }
  return null;
}