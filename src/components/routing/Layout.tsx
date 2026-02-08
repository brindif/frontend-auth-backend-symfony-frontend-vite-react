// src/components/layout/Layout.tsx
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { RouteChangeListener } from "../../components/routing/RouteChangeListener";
import { getTabFromRoute } from "../../utils/tab/manageTab";
import { setCurrentTabs } from "../../store/tab/slice";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentTabs, selectTabs } from "../../store/tab/selectors";

export function Layout() {
  const dispatch = useDispatch();
  const tabs = useAppSelector(selectTabs);
  const currentTabs = useAppSelector(selectCurrentTabs);

  return (
    <>
      <RouteChangeListener
        onPathChange={(pathname) => {
          const tab = getTabFromRoute(tabs, pathname);
          if (!tab && currentTabs.length>0) {
            dispatch(setCurrentTabs(null));
          } else if (tab && currentTabs.at(-1) !== tab['@id']) {
            dispatch(setCurrentTabs(tab));
          }
        }}
      />

      <Outlet />
    </>
  );
}
