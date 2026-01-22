import type { AuthProvider } from "@refinedev/core";

import { loginProvider } from "./loginProvider";
import { registerProvider } from "./registerProvider";
import { logoutProvider } from "./logoutProvider";
import { checkProvider } from "./checkProvider";
import { checkErrorProvider } from "./checkErrorProvider";


export const authProvider: AuthProvider = {
  login: loginProvider,
  register: registerProvider,
  logout: logoutProvider,
  check: checkProvider,
  checkError: checkErrorProvider,
};
