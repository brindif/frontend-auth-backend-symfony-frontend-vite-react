import { api } from "../axiosApi";
import type { Tab as TabType } from "../../store/form/slice";

export type TabsError = {
  success: boolean;
  message: string;
};

export async function tabsRequest(): Promise<TabType[]> {

  const res = await api.get<any>(`/tabs`);
  return res.data?.member;
}
