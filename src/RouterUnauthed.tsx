import { Routes, Route } from "react-router-dom";

import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { UpdatePasswordPage } from "./pages/auth/UpdatePasswordPage";
import { VerifyEmailPage } from "./pages/auth/VerifyEmailPage";
import { ValidateUpdateEmailPage } from "./pages/auth/ValidateUpdateEmailPage";

export default function RouterUnauthed() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/validate-update-email" element={<ValidateUpdateEmailPage />} />
      <Route path="/update-password" element={<UpdatePasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/" element={<LoginPage />} />
    </Routes>
  );
}
