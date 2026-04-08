import { Typography, Layout, Flex, Select, Space, Button, Pagination } from "antd";
import { useAppSelector } from "../../store/hooks";
import { selectContents } from "../../store/tab/selectors";
import { ElementType, ContentType, MethodType, addContent, setContents, clearContents } from "../../store/tab/slice";
import { useList, useTranslate } from "@refinedev/core";
import { PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { ElementForm } from "./ElementForm";

type PostValue = {
  value: string;
  label: string;
  values: Record<string, any>|undefined;
};

type Props = {
  title: string;
  resource: ElementType;
  collection: string;
  get: string;
  post: string;
  put: string;
  patch: string;
  delete: string;
  postValues?: PostValue[];
  tab: string;
};

export function PagerForm({ title, collection, get, post, put, patch, delete: deleteMethod, resource, postValues, tab }: Props) {
  const t = useTranslate();
  const dispatch = useDispatch();

  // Initialise FormElement options
  const queryOptions = {
    resource: resource,
    collection: collection,
    get: get,
    post: post,
    put: put,
    patch: patch,
    delete: deleteMethod,
    updated: false,
  };
  
  // Add element on page
  const [element, setElement] = useState<ContentType|undefined>(undefined);
  const onChange = (value: ElementType, option: any) => {
    setElement({
      ...option,
      ...queryOptions,
      type: value,
      method: MethodType.POST,
    });
  };
  const onAdd = (e:any) => {
    if(!element) return;
    dispatch(addContent(element));
  };
  
  // Initialize contents
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
    filters: [{
      field: "tab",
      operator: "eq",
      value: tab,
    }],
    queryOptions: {
      queryKey: [collection],
      enabled: lastRefetch > -1,
      refetchOnMount: false,
    }
  });
  useEffect(() => {
    if (lastRefetch !== -1) return;
    setLastRefetch(query.dataUpdatedAt);
  }, [tab, currentPage, pageSize]);
  useEffect(() => {
    if (lastRefetch === -1 || lastRefetch === query.dataUpdatedAt || typeof query?.data?.data !== 'object') return;
    // Initialize list of contents
    dispatch(setContents(
      query.data.data.map((element: any) => ({
        ...queryOptions,
        type: resource,
        method: MethodType.PATCH,
        position: element.position ?? 0,
        values: element,
      }))
    ));
    setLastRefetch(-1);
  }, [query.dataUpdatedAt]);

  return <Layout id="content">
      <Flex justify="space-between" align="top">
        <Typography.Title level={1}>
          { title }
        </Typography.Title>
        <Space>
          <Select
            placeholder={ t('app.add.element', {}, 'Add element') }
            onChange={onChange}
            options={postValues} />
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
          showSizeChanger
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }} />
      </Flex>
    </Layout>;
}
