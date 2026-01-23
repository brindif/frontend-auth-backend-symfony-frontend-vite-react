import { useState } from 'react';
import { useTranslate } from "@refinedev/core";
import { Link } from "react-router-dom";
import { Button, Breadcrumb, Layout, Menu, Typography, Tooltip } from "antd";
import { FaRegCalendarAlt, FaIdCard } from "react-icons/fa";
import { FiLogIn, FiUser, FiMenu, FiX } from "react-icons/fi";
import { LogoutButton } from "./pages/auth/LogoutButton"
import { TitlePage } from "./pages/TitlePage";
import Router from "./Router";
import RouterUnauthed from "./RouterUnauthed";
import { appStyles } from "./appStyles";
import { useAppSelector } from "./store/hooks";
import { selectCurrentUser } from "./store/auth/selectors";

const { Header, Content, Footer, Sider } = Layout;

const menu = [
  { key: "nephilim", label: <Link to="/nephilim">Nephilim</Link> },
  { key: "gameofthrone", label: <Link to="/gameofthrone">Trône de Fer</Link> },
];

const submenu = [
  {
    key: "sheet",
    icon: <FaIdCard />,
    label: "Fiches",
    children: [
      { key: "sheet1", label: <Link to="/nephilim/sheet1">Aërîn</Link> },
      { key: "sheet2", label: <Link to="/nephilim/sheet2">Sitala</Link> },
    ],
  },
  {
    key: "note",
    icon: <FaRegCalendarAlt />,
    label: "Notes",
    children: [
      { key: "calendar", label: "Calendrier" },
      { key: "knowledge", label: "Connaissances" },
    ],
  },
];

export default function DashboardPage() {

  const user = useAppSelector(selectCurrentUser);
  const [collapsed, setCollapsed] = useState(false);
  const t = useTranslate();

  return (
    <Layout style={ appStyles.app }>
      <Header style={ appStyles.header }>
        <Link to="/">
          <TitlePage level={3}/>
        </Link>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['nephilim']}
          items={ menu }
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
          <Menu
            mode="inline"
            defaultSelectedKeys={['sheet1']}
            defaultOpenKeys={['sheet']}
            style={ appStyles.submenu }
            items={ submenu }
          />
        </Sider>
        <Layout style={ appStyles.page }>
          <Typography style={ appStyles.nav }>
            <Button
              type="text"
              icon={collapsed ? <FiMenu /> : <FiX />}
              onClick={() => setCollapsed(!collapsed)}
            />
            <Breadcrumb style={ appStyles.breadcrumb } items={[{ title: 'Nephilim' }, { title: 'Fiches' }, { title: 'Aërîn' }]} />
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
