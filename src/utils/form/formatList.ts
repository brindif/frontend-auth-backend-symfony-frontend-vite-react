export const formatList = (route:string, list:any[]): any[] => {
  switch(route) {
    case '/tabs': return formatTabs(list, undefined, 0);
    default: return list;
  }
};

const formatTabs = (list:any[], parent:string|undefined, level: number): any[] => {
  return list.filter((item:any) => item.parent === parent)
    .reduce((acc, item: any) => [
      ...acc,
      {...item, level: level},
      ...formatTabs(list, item['@id'], level+1),
    ], []);
};