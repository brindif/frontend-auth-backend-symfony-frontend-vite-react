
export const appStyles: Record<string, React.CSSProperties> = {
  app: {
    minHeight: '100dvh',
    display: 'flex',
    flexDirection: 'column',
  },
  // Header
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: 0,
    flex: '0 0 auto',
  },
  menu: {
    flex: 1,
    minWidth: 0,
  },
  button: {
    marginRight: "1%",
  },
  // Body
  body: {
    flex: '1 1 auto',
    minHeight: 0,
    overflow: 'auto',
  },
  sider: {
    minHeight: '100dvh',
  },
  submenu: {
    minHeight: '100%',
    borderInlineEnd: 0,
  },
  page: {
    padding: '0 1%',
    display: 'flex',
    flexDirection: 'column',
  },
  nav: {
    flex: '0 0 auto',
    alignItems: "center",
    display: 'flex',
  },
  breadcrumb: {
    margin: '16px 0',
  },
  content: {
    flex: '1 1 auto',
    minHeight: 0,
    overflow: 'auto',
  },
  // Footer
  footer: {
    flex: '0 0 auto',
  },
};