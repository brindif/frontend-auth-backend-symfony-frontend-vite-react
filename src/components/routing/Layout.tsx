// src/components/layout/Layout.tsx
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { RouteChangeListener } from "../../components/routing/RouteChangeListener";
import { getTabFromRoute } from "../../utils/tab/manageTab";
import { setCurrentTabs } from "../../store/tab/slice";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentTabs, selectTabs } from "../../store/tab/selectors";
import { UnsavedChangesNotifier } from "@refinedev/react-router";

export function Layout() {
  const dispatch = useDispatch();
  const tabs = useAppSelector(selectTabs);
  const currentTabs = useAppSelector(selectCurrentTabs);

  return <>
    <UnsavedChangesNotifier />
    <RouteChangeListener
      onPathChange={(pathname) => {
        const tab = getTabFromRoute(tabs, pathname);
        if (!tab && currentTabs.at(-1) !== pathname) {
          dispatch(setCurrentTabs(pathname));
        } else if (tab && currentTabs.at(-1) !== tab['@id']) {
          dispatch(setCurrentTabs(tab));
        }
      }}
    />
    <Outlet />
  </>
}
