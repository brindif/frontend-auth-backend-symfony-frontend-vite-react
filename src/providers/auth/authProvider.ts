import type { AuthProvider } from "@refinedev/core";

import { loginProvider } from "./loginProvider";
import { registerProvider } from "./registerProvider";
import { logoutProvider } from "./logoutProvider";
import { checkProvider } from "./checkProvider";
import { onErrorProvider } from "./onErrorProvider";
import { forgotPasswordProvider } from "./forgotPasswordProvider";
import { updatePasswordProvider } from "./updatePasswordProvider";


export const authProvider: AuthProvider = {
  login: loginProvider,
  register: registerProvider,
  logout: logoutProvider,
  check: checkProvider,
  onError: onErrorProvider,
  forgotPassword: forgotPasswordProvider,
  updatePassword: updatePasswordProvider,
};
