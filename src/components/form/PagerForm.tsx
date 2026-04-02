import { Typography, Layout, Flex, Alert, Select, Space, Button, Pagination } from "antd";
import { useLocation } from "react-router-dom";
import { getTabFromRoute } from "../../utils/tab/manageTab";
import { useAppSelector } from "../../store/hooks";
import { selectTabs, selectContents } from "../../store/tab/selectors";
import { ElementType, ContentType, MethodType, addContent, setContents, clearContents } from "../../store/tab/slice";
import { useList, useTranslate } from "@refinedev/core";
import { PlusOutlined } from "@ant-design/icons";
import { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { ElementForm } from "./ElementForm";

type PostValue = {
  name: string;
  label: string;
  values: Record<string, any>|undefined;
};

type Props = {
  resource: ElementType;
  collection: string;
  get: string;
  post: string;
  put: string;
  patch: string;
  postValues?: PostValue[];
};

export function PagerForm({ collection, get, post, put, patch, resource, postValues }: Props) {
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
    console.log(value, option);
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
  const [pageSize, setPageSize] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastRefetch, setLastRefetch] = useState<number>(-1);
  const { query } = useList({
    resource: resource,
    pagination: { 
      mode: "server",
      pageSize: pageSize,
      currentPage: currentPage,
    },
    queryOptions: {
      queryKey: [collection],
      enabled: lastRefetch > -1,
      refetchOnMount: false,
    }
  });
  useEffect(() => {
    if (contents) return;
    setLastRefetch(query.dataUpdatedAt);
  }, [contents]);
  useEffect(() => {
    if (lastRefetch === -1 || lastRefetch === query.dataUpdatedAt || typeof query?.data?.data !== 'object') return;
    // Initialize list of contents
    dispatch(setContents(
      query.data.data.map((element: any) => ({
        type: resource,
        method: MethodType.PUT,
        get: get,
        post: post,
        put: put,
        patch: patch,
        position: element.position ?? 0,
        values: element,
        updated: false,
      }))
    ));
  }, [query.dataUpdatedAt]);

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
        <ElementForm key={`${content.type}-${index}`} index={index} element={content} />
      ) }
      <Flex justify="center">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={query?.data?.total ?? 0}
          onShowSizeChange={setPageSize}
          showSizeChanger
          onChange={setCurrentPage} />
      </Flex>
    </Layout>
    :
    <Alert type="error" message={ !tab && t('app.error', {}, 'Route undefined') } showIcon />
  );
}
