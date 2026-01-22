import { Routes, Route } from "react-router-dom";

import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { UpdatePasswordPage } from "./pages/auth/UpdatePasswordPage";
import { VerifyEmailPage } from "./pages/auth/VerifyEmailPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProfilePage } from "./pages/auth/Profile";

export default function Router() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/account" element={<ProfilePage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/update-password" element={<UpdatePasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/" element={<DashboardPage />} />
    </Routes>
  );
}
