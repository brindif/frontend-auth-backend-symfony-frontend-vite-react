import { App, Layout, Typography, Flex, Pagination, Button } from "antd";
import { useTranslate, useList, useCreate } from "@refinedev/core";
import { useEffect, useState } from "react";
import { SchemaForm } from "../../components/form/SchemaForm";
import { useAppSelector } from "../../store/hooks";
import { selectList } from "../../store/form/selectors";
import { addList } from "../../store/form/slice";
import { useDispatch } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";

export function SchemasPage () {
  const t = useTranslate();
  const dispatch = useDispatch();
  const schemas = useAppSelector((state) => selectList(state, '/schemas'));
  
  // Select schemas
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastRefetch, setLastRefetch] = useState<number>(-1);
  const { query } = useList({
    resource: "schemas",
    pagination: { 
      mode: "server",
      pageSize: pageSize,
      currentPage: currentPage,
    },
    queryOptions: {
      queryKey: ["/schemas"],
      enabled: lastRefetch > -1,
      refetchOnMount: false,
    }
  });
  useEffect(() => {
    if (schemas) return;
    setLastRefetch(query.dataUpdatedAt);
  }, [schemas]);
  useEffect(() => {
    if (lastRefetch === -1 || lastRefetch === query.dataUpdatedAt) return;
    dispatch(addList({route: '/schemas', list: query.data?.data ?? []}));
    setLastRefetch(-1);
  }, [query, lastRefetch]);

  //Pager
  useEffect(() => {
    setLastRefetch(query.dataUpdatedAt);
  }, [currentPage, pageSize]);

  //Create schema
  const { message } = App.useApp();
  const { mutate: create } = useCreate();
  const onCreate = () => {
    create({
      resource: 'schema',
      values: {},
    }, {
      onSuccess:(data: any) => {
        message.success(t("schema.success", {}, "Schema created successfully"), 10);
      },
      onError: (error: any) => {
        message.error(t(error?.message ?? "schema.error.request", {}, "Error creating schema"), 10);
      } 
    });
    setLastRefetch(query.dataUpdatedAt);
  };

  return (
    <Layout id="content">
      <Flex align="baseline" gap={10}>
        <Typography.Title level={3}>
          { t('schema.title', {}, 'Schemas') }
        </Typography.Title>
        <Button
          title={t('schema.button.add', {}, 'Add schemas')}
          shape="circle"
          size="small"
          onClick={onCreate}
          icon={<PlusOutlined />} />
      </Flex>
      <Flex align="top" wrap>
        { query && query?.data?.data.map((schema, index) =>
          <SchemaForm key={schema['@id']} index={index} />
        )}
      </Flex>
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
  );
}