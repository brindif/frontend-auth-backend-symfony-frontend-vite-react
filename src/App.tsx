import { useState } from 'react';
import { useTranslate } from "@refinedev/core";
import { Link } from "react-router-dom";
import { Button, Breadcrumb, Layout, Menu, Typography, Tooltip } from "antd";
import { FiLogIn, FiUser, FiMenu, FiX } from "react-icons/fi";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { LogoutButton } from "./pages/auth/LogoutButton"
import { Title } from "./components/Title";
import Router from "./Router";
import RouterUnauthed from "./RouterUnauthed";
import { appStyles } from "./appStyles";
import { useAppSelector } from "./store/hooks";
import { selectCurrentUser } from "./store/auth/selectors";
import { MenuApp } from "./components/MenuApp";
import { selectCurrentTabs } from "./store/form/selectors";
import "./app.css";

const { Header, Content, Footer, Sider } = Layout;

export default function DashboardPage() {

  const user = useAppSelector(selectCurrentUser);
  const [collapsed, setCollapsed] = useState(false);
  const t = useTranslate();
  const selectedTabs = useAppSelector(selectCurrentTabs);

  return (
    <Layout style={ appStyles.app }>
      <Header style={ appStyles.header }>
        <Link to="/">
          <Title level={3}/>
        </Link>
        <MenuApp
          mode="horizontal"
          style={ appStyles.menu }
        />
        { user === null &&
          <Link to="/login" style={ appStyles.button }>
            <Tooltip title={t("menu.login.tooltip", {}, "Login")}>
              <Button icon={<FiLogIn />} />
            </Tooltip>
          </Link>
        }
        { user !== null && 
          <>
            <Link to="/account" style={ appStyles.button }>
              <Tooltip title={t("menu.account.tooltip", {}, "Account")}>
                <Button shape="circle" icon={<FiUser />} />
              </Tooltip>
            </Link>
            <Tooltip title={t("menu.logout.tooltip", {}, "Logout")}>
              <LogoutButton style={ appStyles.button } />
            </Tooltip>
          </>
        }
      </Header>
      <Layout style={ appStyles.body }>
        <Sider style={ appStyles.sider }  trigger={null} collapsible collapsed={collapsed}>
          <MenuApp
            mode="inline"
            style={ appStyles.submenu }
          />
        </Sider>
        <Layout style={ appStyles.page }>
          <Typography style={ appStyles.nav }>
            <Button
              type="text"
              icon={collapsed ? <FiMenu /> : <FiX />}
              onClick={() => setCollapsed(!collapsed)}
            />
            <Breadcrumb style={ appStyles.breadcrumb } items={selectedTabs.map(tab => ({title: tab.name}))} />
          </Typography>
          <Content style={ appStyles.content }>
            { user === null &&
              <RouterUnauthed />
            }
            { user !== null &&
              <Router />
            }
          </Content>
        </Layout>
      </Layout>
      <Footer style={ appStyles.footer }>
      </Footer>
    </Layout>
  );
}
