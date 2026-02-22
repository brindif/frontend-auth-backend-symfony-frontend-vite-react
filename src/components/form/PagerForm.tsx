import { Typography, Layout, Flex, Alert, Select, Space, Button } from "antd";
import { useLocation } from "react-router-dom";
import { getTabFromRoute } from "../../utils/tab/manageTab";
import { useAppSelector } from "../../store/hooks";
import { selectTabs, selectContents } from "../../store/tab/selectors";
import { ElementType, ContentType, MethodType, addContent, setContents, clearContents } from "../../store/tab/slice";
import { useCustom, useTranslate } from "@refinedev/core";
import { PlusOutlined } from "@ant-design/icons";
import { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { ContentForm } from "./ContentForm";

type PostValue = {
  name: string;
  label: string;
  values: Record<string, any>|undefined;
};

type Props = {
  label: string;
  type: ElementType;
  get: string;
  post: string;
  put: string;
  patch: string;
  postValues?: Record<string, PostValue>;
};

export function ContentPage({ get, post, put, patch, type, label, postValues }: Props) {
  const t = useTranslate();
  const dispatch = useDispatch();

  // Initialize tab
  const location = useLocation();
  const tabs = useAppSelector(selectTabs);
  const tab = getTabFromRoute(tabs, location.pathname);

  // Define page elements
  const createElements = useMemo(() => tab && postValues ? postValues : [], [tab]);
  
  // Add element on page
  const [element, setElement] = useState<ContentType|undefined>(undefined);
  const onChange = (value: ElementType, option: any) => {
    setElement({
      ...option,
      type: value,
      method: MethodType.POST,
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
      get: get,
      post: post,
      put: put,
      patch: patch,
      type: type,
      method: MethodType.PATCH,
      loaded: false,
    })));
  }, [tab]);
  const [queries, setQueries] = useState<ContentType[]>([]);
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
      if (pageElement.get === lastQuery.url && query.dataUpdatedAt){
        // Load data in query
        pageElement.values = query.data?.data?.member;
      }
      if (!pageElement.loaded && unloaded === null){
        // Launch query
        unloaded = pageElement.get;
        pageElement.loaded = true;
      }
      return pageElement;
    });
    setLastQuery({ url: unloaded ?? '', dataUpdatedAt: query.dataUpdatedAt });
    setQueries(updatedQueries);
    
    // Initialize list of contents whene all page elements are loaded
    if (unloaded) return;
    dispatch(setContents(
      updatedQueries.reduce((acc:ContentType[], pageElement: ContentType) => {
        if (!pageElement.values || !pageElement.values.length) return acc;
        return [
          ...acc,
          ...pageElement.values.map((content: any) => ({
            ...pageElement,
            values: content,
            updated: false,
            position: content.position ?? 0,
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
            options={createElements} />
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
