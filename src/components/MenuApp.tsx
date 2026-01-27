import { useTranslate } from "@refinedev/core";
import { useAppSelector } from "./../store/hooks";
import { selectCurrentTabs, selectTree } from "./../store/form/selectors";
import { Link, useNavigate } from "react-router-dom";
import { Button, Menu, MenuProps } from "antd";
import { CalendarOutlined, FileTextOutlined, ApartmentOutlined, ReadOutlined, EditOutlined } from "@ant-design/icons";
import { setCurrentTabs, Tab } from "../store/form/slice";
import { useDispatch } from "react-redux";
import type { CSSProperties } from "react";

const tabTypeIcon = (type: string | undefined):any => {
  switch(type) {
    case "calendar": return <CalendarOutlined />;
    case "note": return <FileTextOutlined />;
    case "tree": return <ApartmentOutlined />;
    default: return <ReadOutlined />;
  }
};

export function MenuApp(props: { mode?: MenuProps["mode"]; style?: CSSProperties; }) {
  const t = useTranslate();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tree = useAppSelector(selectTree);
  const selectedTabs = useAppSelector(selectCurrentTabs);
  const selectedTabsKeys = selectedTabs.reduce(
    (acc: string[], tab: Tab) => tab['@id'] ? [...acc, tab['@id']] : acc,
    []
  );

  const tabsToMenuItem = (tabs: Tab[], isTree: boolean, route?: string): NonNullable<MenuProps["items"]> => (
    tabs.map((tab, key) => ({
      icon: tabTypeIcon(tab.type),
      itemIcon: <Button onMouseDown={e => e.stopPropagation()} onClick={e => {
        e.stopPropagation();
        navigate(`/form/tab/${tab.id}`);
      }} shape="circle" size="small" icon={<EditOutlined />} />,
      key: tab['@id'] ?? `tab-${key}`,
      label: <Link to={tab.route}>{ t(tab.name, {}, tab.defaultName ?? undefined) }</Link>,
      ...(isTree && tab.children && tab.children.length > 0 ? {
        children: tabsToMenuItem(tab.children, isTree),
      } :  {}),
    })
  ));
  
  const tabsDefault = props.mode === 'horizontal' ? tree : tree.find(tab => selectedTabsKeys.includes(tab['@id']))?.children;
  const tabs = tabsDefault ? tabsToMenuItem(tabsDefault, props.mode === 'horizontal', '') : [];

  const onSelect = (key: string) => {
    dispatch(setCurrentTabs(tree.find(tab => tab['@id'] === key) ?? null));
  };

  return tabs.length > 0 && <Menu
    theme="dark"
    mode={ props.mode }
    onSelect={({ key }) => onSelect(key)}
    defaultSelectedKeys={ selectedTabsKeys }
    defaultOpenKeys={ selectedTabsKeys }
    items={ tabs }
    style={ props.style }
  />;
}
