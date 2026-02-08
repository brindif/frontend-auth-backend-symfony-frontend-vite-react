import { Select } from "antd";
import { useCustom, useTranslate } from "@refinedev/core";
import { XList } from "../../utils/form/openApiTypes";
import { useAppSelector } from "../../store/hooks";
import { selectList } from "../../store/form/selectors";
import { addList } from "../../store/form/slice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

type Props = {
  xList: XList;
  value?: any;
  onChange?: (value: any) => void;
};

export function XListSelect({ xList, value, onChange }: Props) {
  const t = useTranslate();
  const dispatch = useDispatch();

  let items = useAppSelector((store) => selectList(store, xList.route));

  const [isNedeed, setIsNedeed] = useState(false);

  const { query } = useCustom({
    url: xList.route,
    method: "get",
    queryOptions: {
      enabled: isNedeed,
      refetchOnMount: false,
    }
  });

  useEffect(() => {
    if (isNedeed && query.isSuccess) {
      dispatch(addList({route: xList.route, list: query.data?.data?.member ?? []}));
      setIsNedeed(false);
      return;
    }
    if (!isNedeed && !items) {

      setIsNedeed(true);
      return;
    }
  }, [items, isNedeed, query]);

  return (
    <Select
      loading={!items}
      value={value}
      onChange={onChange}
      options={items ? items.map((item: any) => ({
        value: item[xList.identifier],
        label: t(item[xList.label], {}, xList.labelDefault ? item[xList.labelDefault] : undefined),
      })) : []}
    />
  );
}
