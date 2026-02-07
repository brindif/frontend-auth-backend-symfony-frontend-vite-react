export const getTab = (tabs:Record<string, any>|null, id:string): any|null => {
  if(tabs && tabs[id])
    return tabs[id];
  else if (tabs && Object.keys(tabs).length)
    for(let childTab of Object.values(tabs)) {
      return getTab(childTab.children, id);
    }
  else
    return null;
};