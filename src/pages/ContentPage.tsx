import { PagerForm } from "../components/form/PagerForm";
import { ElementType } from "../store/tab/slice";
import { getTabFromRoute } from "../utils/tab/manageTab";
import { useAppSelector } from "../store/hooks";
import { selectTabs } from "../store/tab/selectors";
import { useTranslate } from "@refinedev/core";
import { Alert } from "antd";

export function ContentPage() {
  const t = useTranslate();
  const tabs = useAppSelector(selectTabs);
  const tab = getTabFromRoute(tabs, location.pathname);

  return tab ? <PagerForm
    title={ t(tab.name, {}, tab.nameDefault ?? undefined) }
    resource={ElementType.NOTE}
    collection="/notes"
    get={`/notes?tab=${tab['@id']}`}
    post="/note"
    put="/note/{id}"
    patch="/note/{id}"
    delete="/note/{id}"
    tab={tab['@id']}
    postValues={[{
      value: 'note',
      label: t('form.note', {}, 'Note'),
      values: {
        tab: tab['@id'],
      },
    }]}
  />
  :
  <Alert type="error" message={ !tab && t('app.error', {}, 'Route undefined') } showIcon />;
};