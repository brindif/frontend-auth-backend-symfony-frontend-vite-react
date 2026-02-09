import { Typography, Layout, Flex, Alert, Select, Space, Button } from "antd";
import { useLocation } from "react-router-dom";
import { getTabFromRoute } from "../utils/tab/manageTab";
import { useAppSelector } from "../store/hooks";
import { selectTabs, selectContents } from "../store/tab/selectors";
import { ElementType, ContentType, MethodType, addContent, setContents, clearContents } from "../store/tab/slice";
import { useCustom, useTranslate } from "@refinedev/core";
import { PlusOutlined } from "@ant-design/icons";
import { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { ContentForm } from "../components/form/ContentForm";

export type QueryType = {
  type: ElementType;
  url: string;
  path: string;
  loaded: boolean;
  values: any[]|null;
};

export function ContentPage() {
  const t = useTranslate();
  const dispatch = useDispatch();

  // Initialize tab
  const location = useLocation();
  const tabs = useAppSelector(selectTabs);
  const tab = getTabFromRoute(tabs, location.pathname);

  // Define page elements
  const pageElements = useMemo(() => tab ? [
    {
      label: t('app.note', {}, 'Note'),
      value: ElementType.NOTE,
      get: `/notes?tab=${tab['@id']}`,
      post: '/note',
      put: '/note/{id}',
      patch: '/note/{id}',
    },
  ] : [], [tab]);
  
  // Add element on page
  const [element, setElement] = useState<ContentType|undefined>(undefined);
  const onChange = (value: ElementType, option: any) => {
    setElement({
      type: value,
      method: MethodType.POST,
      path: option.post,
      list: option.get,
    });
  };
  const onAdd = (e:any) => {
    if(!element) return;
    dispatch(addContent(element));
  };
  
  // Initialize tab contents
  const contents = useAppSelector(selectContents);
  useEffect(() => {
    if (!tab) return;
    if (contents.length) dispatch(clearContents());
    setQueries(pageElements.map((pageElement) => ({
      url: pageElement.get,
      path: pageElement.put,
      loaded: false,
      values: null,
      type: pageElement.value,
    })));
  }, [tab]);
  const [queries, setQueries] = useState<QueryType[]>([]);
  const [lastQuery, setLastQuery] = useState<{dataUpdatedAt: number; url: string}>({ dataUpdatedAt: -1, url: '' });
  const { query } = useCustom({
    url: lastQuery.url,
    method: "get",
    queryOptions: {
      queryKey: [lastQuery.url],
      enabled: lastQuery.dataUpdatedAt > -1 && lastQuery.url.length > 0,
      refetchOnMount: true,
    }
  });
  useEffect(() => {
    if (lastQuery.dataUpdatedAt >= query.dataUpdatedAt || queries.length < 1) return;
    let unloaded:string|null = null;
    let updatedQueries = [...queries];
    updatedQueries = updatedQueries.map((pageElement) => {
      if (pageElement.url === lastQuery.url && query.dataUpdatedAt){
        // Load data in query
        pageElement.values = query.data?.data?.member;
      }
      if (!pageElement.loaded && unloaded === null){
        // Launch query
        unloaded = pageElement.url;
        pageElement.loaded = true;
      }
      return pageElement;
    });
    setLastQuery({ url: unloaded ?? '', dataUpdatedAt: query.dataUpdatedAt });
    setQueries(updatedQueries);
    
    // Initialize list of contents whene all page elements are loaded
    if (unloaded) return;
    dispatch(setContents(
      updatedQueries.reduce((acc:ContentType[], pageElement) => {
        if (!pageElement.values || !pageElement.values.length) return acc;
        return [
          ...acc,
          ...pageElement.values.map(content => ({
            type: pageElement.type,
            method: MethodType.PUT,
            path: pageElement.path,
            values: content,
            updated: false,
            position: content.position ?? 0,
            list: pageElement.url,
          })),
        ];
      }, []).sort((a:ContentType, b:ContentType) => (a.position ?? 0) - (b.position ?? 0))
    ));
  }, [queries, query.dataUpdatedAt]);

  return (tab ?
    <Layout id="content">
      <Flex justify="space-between" align="top">
        <Typography.Title level={1}>
          { t(tab.name, {}, tab.nameDefault ?? undefined) }
        </Typography.Title>
        <Space>
          <Select
            placeholder={ t('app.add.element', {}, 'Add element') }
            onChange={onChange}
            options={pageElements} />
          { element !== undefined && <Button
            onClick={onAdd}
            size="small"
            shape="circle"
            icon={<PlusOutlined />} /> }
        </Space>
      </Flex>
      { contents && contents.map((content:ContentType, index:number) => 
        <ContentForm key={`${content.type}-${index}`} index={index} element={content} />
      ) }
    </Layout>
    :
    <Alert type="error" message={ !tab && t('app.error', {}, 'Route undefined') } showIcon />
  );
}
