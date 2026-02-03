import { useTranslate } from "@refinedev/core";
import { useAppSelector } from "./../store/hooks";
import { selectCurrentTabs, selectTabs, selectTree } from "./../store/tab/selectors";
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
import { setCurrentTabs, Tab } from "../store/tab/slice";
import { useDispatch } from "react-redux";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";

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
  const tree = useAppSelector(selectTree);
  const list = useAppSelector(selectTabs);
  const selectedTabs = useAppSelector(selectCurrentTabs);

  // Initialize on select tab action
  const onSelect = (key: string) => {
    const tab = list?.find(tab => tab['@id'] === key);
    if (!tab) return;
    setSelectedButtonKey(null);
    dispatch(setCurrentTabs(tab));
    navigate(`/${tab.route}`);
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
      key: (isTree && tab.children && tab.children.length > 0 ? 'cat-' : '')+(tab['@id'] ?? `tab-${key}`),
      label: <>
        { t(tab.name, {}, tab.defaultName ?? undefined) }
        <Button
          onClick={e => onEditTab(e, tab)}
          shape="circle"
          size="small"
          icon={<FormOutlined />}
          type={selectedButtonKey === tab['@id'] ? "primary" : "default"} />
      </>,
      ...(isTree && tab.children && tab.children.length > 0 ? {
        children: [
          { // Parent tab can be used as tab
            icon: <ArrowRightOutlined />,
            key: tab['@id'] ?? `tab-${key}`,
            label: <Typography className="sub-menu">{t(tab.name, {}, tab.defaultName ?? undefined)}</Typography>
          }, 
          ...tabsToMenuItem(tab.children, isTree, `${route}/${tab.route}`)
        ],
      } :  {}),
    })
  ));
  
  // Create current tabs list
  const selectedTabsKeys = useMemo(() => selectedTabs.reduce(
    (acc: string[], tab: Tab) => tab['@id'] ? [...acc, tab['@id']] : acc,
    []
  ), [selectedTabs]);
  
  // Create tabs list for menu
  const tabs = useMemo(() => {
    const parent = isTopMenu ? undefined : tree.find(tab => selectedTabsKeys.includes(tab['@id']));
    const tabsDefault = parent ? (parent?.children ?? []) : (isTopMenu ? tree : undefined);

    return tabsDefault ? tabsToMenuItem(tabsDefault, !isTopMenu, parent ? parent?.route : '') : [];
  }, [tree, selectedTabsKeys, isTopMenu]);

  return tabs.length > 0 && <Menu
    theme="dark"
    mode={ props.mode }
    onSelect={({ key }) => onSelect(key)}
    selectedKeys={ selectedTabsKeys }
    defaultOpenKeys={ selectedTabsKeys }
    items={ tabs }
    style={ props.style }
  />;
}
