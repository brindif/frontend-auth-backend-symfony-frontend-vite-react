import type { AuthProvider } from "@refinedev/core";

import { loginProvider } from "./loginProvider";
import { registerProvider } from "./registerProvider";
import { logoutProvider } from "./logoutProvider";
import { checkProvider } from "./checkProvider";
import { onErrorProvider } from "./onErrorProvider";
import { updateRequestProvider } from "./updateRequestProvider";
import { updateWithTokenProvider } from "./updateWithTokenProvider";


export const authProvider: AuthProvider = {
  login: loginProvider,
  register: registerProvider,
  logout: logoutProvider,
  check: checkProvider,
  onError: onErrorProvider,
  forgotPassword: updateRequestProvider,
  updatePassword: updateWithTokenProvider,
};
