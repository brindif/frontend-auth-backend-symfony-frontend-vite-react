import { useState } from 'react';
import { useTranslate } from "@refinedev/core";
import { Link } from "react-router-dom";
import { Button, Breadcrumb, Layout, Tooltip } from "antd";
import { FiLogIn, FiUser, FiMenu, FiX } from "react-icons/fi";
import { TeamOutlined, DatabaseOutlined } from '@ant-design/icons';
import { LogoutButton } from "./pages/auth/LogoutButton"
import { Title } from "./components/Title";
import Router from "./Router";
import { useAppSelector } from "./store/hooks";
import { selectCurrentUser } from "./store/auth/selectors";
import { MenuApp } from "./components/MenuApp";
import { selectCurrentTabs, selectTabs } from "./store/tab/selectors";
import { getTab } from "./utils/tab/manageTab";
import { RoleType } from "./store/auth/slice";
import "./app.css";

const { Header, Content, Footer, Sider } = Layout;

export default function DashboardPage() {

  const user = useAppSelector(selectCurrentUser);
  const [collapsed, setCollapsed] = useState(false);
  const t = useTranslate();
  const selectedTabs = useAppSelector(selectCurrentTabs);
  const tabs = useAppSelector(selectTabs);

  return (
    <Layout id="app">
      <Header>
        <Link to="/">
          <Title level={3}/>
        </Link>
        <MenuApp mode="horizontal" id="menu" />
        { user === null &&
          <Link to="/login" id="button">
            <Tooltip title={t("menu.login.tooltip", {}, "Login")}>
              <Button
                icon={<FiLogIn />}
                type={selectedTabs.at(-1) === `/login` ? "primary" : "default"} />
            </Tooltip>
          </Link>
        }
        { user !== null && 
          <>
            {(!user?.roles.includes(RoleType.guest) || user?.roles?.length > 1) &&
              <Link to="/schemas" id="button">
                <Tooltip title={t("menu.schemas.tooltip", {}, "Schemas")}>
                  <Button
                    shape="circle"
                    icon={<DatabaseOutlined />}
                    type={selectedTabs.at(-1) === `/schemas` ? "primary" : "default"} />
                </Tooltip>
              </Link>
            }
            {user?.roles.includes(RoleType.admin) &&
              <Link to="/users" id="button">
                <Tooltip title={t("menu.users.tooltip", {}, "Users")}>
                  <Button
                    shape="circle"
                    icon={<TeamOutlined />}
                    type={selectedTabs.at(-1) === `/users` ? "primary" : "default"} />
                </Tooltip>
              </Link>
            }
            <Link to="/account" id="button">
              <Tooltip title={t("menu.account.tooltip", {}, "Account")}>
                <Button
                  shape="circle"
                  icon={<FiUser />}
                  type={selectedTabs.at(-1) === `/account` ? "primary" : "default"} />
              </Tooltip>
            </Link>
            <Tooltip title={t("menu.logout.tooltip", {}, "Logout")}>
              <LogoutButton id="button" />
            </Tooltip>
          </>
        }
      </Header>
      <Layout id="body">
        <Sider id="sider"  trigger={null} collapsible collapsed={collapsed}>
          <MenuApp mode="inline" id="submenu" />
        </Sider>
        <Layout id="page">
          <Layout id="nav">
            <Button
              type="text"
              icon={collapsed ? <FiMenu /> : <FiX />}
              onClick={() => setCollapsed(!collapsed)}
            />
            <Breadcrumb items={selectedTabs.map(id => {
              const tab = getTab(tabs, id);
              if (tab) {
                return { title: <Link to={tab.path}>{ t(tab.name, {}, tab.defaultName ?? undefined) }</Link> };
              } else {
                return { title: <Link to={id}>{t(`breadcrumb.name${id.replaceAll('/', '.')}`, {}, id.replaceAll('/', ' '))}</Link> }
              }
            })} />
          </Layout>
          <Content>
            <Router />
          </Content>
        </Layout>
      </Layout>
      <Footer>
      </Footer>
    </Layout>
  );
}
