import { Layout, Typography, Flex, Pagination } from "antd";
import { useTranslate, useList } from "@refinedev/core";
import { useEffect, useState } from "react";
import { UserForm } from "../../components/form/UserForm";
import { useAppSelector } from "../../store/hooks";
import { selectList } from "../../store/form/selectors";
import { addList } from "../../store/form/slice";
import { useDispatch } from "react-redux";
import { useTable } from "@refinedev/antd";

export function UsersPage () {
  const t = useTranslate();
  const dispatch = useDispatch();
  const users = useAppSelector((state) => selectList(state, '/users'));
  
  // Select users
  const [pageSize, setPageSize] = useState<number>(4);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastRefetch, setLastRefetch] = useState<number>(-1);
  const { query } = useList({
    resource: "users",
    pagination: { 
      mode: "server",
      pageSize: pageSize,
      currentPage: currentPage,
    },
    queryOptions: {
      queryKey: ["/users"],
      enabled: lastRefetch > -1,
      refetchOnMount: false,
    }
  });
  useEffect(() => {
    if (users) return;
    setLastRefetch(query.dataUpdatedAt);
  }, [users]);
  useEffect(() => {
    if (lastRefetch === -1 || lastRefetch === query.dataUpdatedAt) return;
    dispatch(addList({route: '/users', list: query.data?.data ?? []}));
    setLastRefetch(-1);
  }, [query, lastRefetch]);

  //Pager
  useEffect(() => {
    setLastRefetch(query.dataUpdatedAt);
  }, [currentPage, pageSize]);

  return (
    <Layout id="content">
      <Typography.Title level={1}>
        { t('app.form.users', {}, 'Users') }
      </Typography.Title>
      <Flex align="top" wrap>
        { query && query?.data?.data.map((user, index) =>
          <UserForm key={user['@id']} index={index} />
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