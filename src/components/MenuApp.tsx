import { useCustom, useTranslate } from "@refinedev/core";
import { useAppSelector } from "../store/hooks";
import { selectCurrentTabs, selectTabs } from "../store/tab/selectors";
import { getTab } from "../utils/tab/manageTab";
import { useNavigate } from "react-router-dom";
import { Button, Menu, MenuProps, Typography } from "antd";
import {
  CalendarOutlined,
  FileTextOutlined,
  ApartmentOutlined,
  ReadOutlined,
  FormOutlined,
  ArrowRightOutlined
} from "@ant-design/icons";
import { setCurrentTabs, Tab, PermissionType } from "../store/tab/slice";
import { useDispatch } from "react-redux";
import type { CSSProperties } from "react";
import { useMemo, useState, useEffect } from "react";
import { setTabs } from "../store/tab/slice";

const tabTypeIcon = (type: string | undefined):any => {
  switch(type) {
    case "calendar": return <CalendarOutlined />;
    case "note": return <FileTextOutlined />;
    case "tree": return <ApartmentOutlined />;
    default: return <ReadOutlined />;
  }
};

export function MenuApp(props: { mode?: MenuProps["mode"]; style?: CSSProperties; }) {
  const isTopMenu = props.mode === 'horizontal';
  const t = useTranslate();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tabs = useAppSelector(selectTabs);
  const selectedTabs = useAppSelector(selectCurrentTabs);

  // Initialize tabs if undefined
  const [shouldRefetchTabs, setShouldRefetchTabs] = useState(tabs === null);
  const { query: queryTabs } = useCustom({
    url: '/tabs',
    method: "get",
    queryOptions: { enabled: shouldRefetchTabs, refetchOnMount: false }
  });
  useEffect(() => {
    if (shouldRefetchTabs && queryTabs.isSuccess && queryTabs.data?.data?.member) {
      dispatch(setTabs(queryTabs.data?.data?.member));
      setShouldRefetchTabs(false);
    }
  }, [queryTabs.isSuccess, queryTabs.data, shouldRefetchTabs]);

  // Initialize on select tab action
  const onSelect = (key: string) => {
    const tab = getTab(tabs, key);
    if (!tab) return;
    setSelectedButtonKey(null);
    dispatch(setCurrentTabs(tab));
    navigate(`/${tab.path}`);
  };

  // Initialize edit tab form action
  const [selectedButtonKey, setSelectedButtonKey] = useState<string | null>(null);
  const onEditTab = (e: any, tab: Tab) => {
    e.preventDefault();
    e.stopPropagation();
    // Set current tabs to edited tab
    dispatch(setCurrentTabs(tab));
    // Active button color
    setSelectedButtonKey(tab['@id'] ?? null);
    navigate(`/form/tab/${tab.id}`);
  }

  // Initialize menu generation
  const tabsToMenuItem = (tabs: Tab[], isTree: boolean, route?: string): NonNullable<MenuProps["items"]> => (
    tabs.map((tab, key) => ({
      icon: tabTypeIcon(tab.type),
      key: (isTree && tab.children && Object.keys(tab.children).length > 0 ? 'cat-' : '')+(tab['@id'] ?? `tab-${key}`),
      label: <>
        { t(tab.name, {}, tab.defaultName ?? undefined) }
        { tab.permission === PermissionType.MANAGE && <Button
          onClick={e => onEditTab(e, tab)}
          shape="circle"
          size="small"
          icon={<FormOutlined />}
          type={selectedButtonKey === tab['@id'] ? "primary" : "default"} /> }
      </>,
      ...(isTree && tab.children && Object.keys(tab.children).length > 0 ? {
        children: [
          { // Parent tab can be used as tab
            icon: <ArrowRightOutlined />,
            key: tab['@id'] ?? `tab-${key}`,
            label: <Typography className="sub-menu">{t(tab.name, {}, tab.defaultName ?? undefined)}</Typography>
          }, 
          ...tabsToMenuItem(Object.values(tab.children), isTree, `${route}/${tab.route}`)
        ],
      } :  {}),
    })
  ));
  
  // Create tabs list for menu
  const menu = useMemo(() => {
    if (!tabs || !Object.keys(tabs).length) return [];
    const parent = isTopMenu ? undefined : Object.values(tabs).find((tab: Tab) => selectedTabs.includes(tab['@id']));
    const tabsDefault = parent ? (parent?.children ?? {}) : (isTopMenu ? tabs : undefined);

    return tabsDefault ? tabsToMenuItem(Object.values(tabsDefault), !isTopMenu, parent ? parent?.route : '') : [];
  }, [tabs, selectedTabs, isTopMenu]);

  return menu && <Menu
    theme="dark"
    mode={ props.mode }
    onSelect={({ key }) => onSelect(key)}
    selectedKeys={ selectedTabs }
    defaultOpenKeys={ selectedTabs }
    items={ menu }
    style={ props.style }
  />;
}
