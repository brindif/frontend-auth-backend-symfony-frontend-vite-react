import { useCustom, useTranslate } from "@refinedev/core";
import { useAppSelector } from "../store/hooks";
import { selectCurrentTabs, selectOpenTabs, selectTabs } from "../store/tab/selectors";
import { getTab } from "../utils/tab/manageTab";
import { useNavigate } from "react-router-dom";
import { Button, Menu, MenuProps } from "antd";
import { CalendarOutlined, FileTextOutlined, ApartmentOutlined, ReadOutlined, FormOutlined } from "@ant-design/icons";
import { setTabs, setCurrentTabs, setOpenTabs, Tab, PermissionType } from "../store/tab/slice";
import { useDispatch } from "react-redux";
import { useMemo, useState, useEffect } from "react";

const tabTypeIcon = (type: string | undefined):any => {
  switch(type) {
    case "calendar": return <CalendarOutlined />;
    case "note": return <FileTextOutlined />;
    case "tree": return <ApartmentOutlined />;
    default: return <ReadOutlined />;
  }
};

export function MenuApp(props: { mode?: MenuProps["mode"]; id?: string; }) {
  const isTopMenu = props.mode === 'horizontal';
  const t = useTranslate();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tabs = useAppSelector(selectTabs);
  const currentTabs = useAppSelector(selectCurrentTabs);
  const openTabs = useAppSelector(selectOpenTabs);

  // Initialize tabs if undefined
  const [lastRefetchTabs, setLastRefetchTabs] = useState<number>(-1);
  const { query: queryTabs } = useCustom({
    url: '/tabs',
    method: "get",
    queryOptions: { enabled: lastRefetchTabs > -1, refetchOnMount: false }
  });
  useEffect(() => {
    if (tabs) return;
    setLastRefetchTabs(queryTabs.dataUpdatedAt);
  }, [tabs]);
  useEffect(() => {
    if (lastRefetchTabs === -1 || lastRefetchTabs === queryTabs.dataUpdatedAt) return;
    dispatch(setTabs(queryTabs.data?.data?.member));
    setLastRefetchTabs(-1);
  }, [queryTabs, lastRefetchTabs]);

  // Initialize handle open change
  const handleOpenChange = (nextOpenKeys:string[]) => {
    dispatch(setOpenTabs(nextOpenKeys));
    if(!nextOpenKeys.length) return;
    const tab = getTab(tabs, nextOpenKeys.at(-1));
    if (!tab) return;
    navigate(`/${tab.path}`);
  };

  // Initialize on select tab action
  const onSelect = (key: string) => {
    const tab = getTab(tabs, key);
    if (!tab) return;
    navigate(`/${tab.path}`);
  };

  // Initialize edit tab form action
  const onEditTab = (e: any, tab: Tab) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/form/tab/${tab.id}`);
  }

  // Initialize menu generation
  const tabsToMenuItem = (tabs: Tab[], isTree: boolean, route?: string): NonNullable<MenuProps["items"]> => (
    tabs.map((tab, key) => ({
      icon: tabTypeIcon(tab.type),
      key: tab['@id'] ?? `tab-${key}`,
      label: <>
        { t(tab.name, {}, tab.defaultName ?? undefined) }
        { tab.permission === PermissionType.MANAGE && <Button
          onClick={e => onEditTab(e, tab)}
          shape="circle"
          size="small"
          icon={<FormOutlined />}
          type={currentTabs.at(-1) === `/form/tab/${tab.id}` ? "primary" : "default"} /> }
      </>,
      ...(isTree && tab.children && Object.keys(tab.children).length > 0 ? {
        children: tabsToMenuItem(Object.values(tab.children), isTree, `${route}/${tab.route}`),
      } :  {}),
    })
  ));
  
  // Default parent tab
  const [parentTab, setParentTab] = useState<string|undefined>(undefined);
  useEffect(() => {
    // Set parent tab for right menu
    if (isTopMenu || !currentTabs.length || !tabs) return;
    let parentId = currentTabs.at(0);
    if (!parentId || !tabs[parentId]) return;
    setParentTab(parentId);
  }, [currentTabs]);

  // Create tabs list for menu
  const menu = useMemo(() => {
    if (!tabs || !Object.keys(tabs).length) return [];
    const parent = parentTab && tabs[parentTab] ? tabs[parentTab] : undefined;
    const tabsDefault = parent ? (parent?.children ?? {}) : (isTopMenu ? tabs : undefined);

    return tabsDefault ? tabsToMenuItem(Object.values(tabsDefault), !isTopMenu, parent ? parent?.route : '') : [];
  }, [tabs, currentTabs, isTopMenu, parentTab]);

  return menu && <Menu
    theme="dark"
    mode={ props.mode }
    onSelect={({ key }) => onSelect(key)}
    selectedKeys={ currentTabs }
    openKeys={ openTabs }
    onOpenChange={ handleOpenChange }
    items={ menu }
    id={ props.id }
  />;
}
