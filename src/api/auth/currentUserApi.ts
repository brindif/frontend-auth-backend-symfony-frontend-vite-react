import { api } from "../axiosApi";

export type CurrentUserSuccess = {
  success: boolean;
  message: string;
  user: {
    name: string;
    email: string;
    roles: [];
  };
};
export type CurrentUserError = {
  success: boolean;
  message: string;
};

export async function currentUserRequest(): Promise<CurrentUserSuccess> {

  const res = await api.get<CurrentUserSuccess>(`/me`);

  return res.data;
}
