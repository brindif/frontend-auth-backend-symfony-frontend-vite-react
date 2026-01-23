import { Routes, Route } from "react-router-dom";

import { UpdatePasswordPage } from "./pages/auth/UpdatePasswordPage";
import { VerifyEmailPage } from "./pages/auth/VerifyEmailPage";
import { CheckEmailPage } from "./pages/auth/CheckEmailPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProfilePage } from "./pages/auth/Profile";

export default function Router() {
  return (
    <Routes>
      <Route path="/account" element={<ProfilePage />} />
      <Route path="/update-password" element={<UpdatePasswordPage />} />
      <Route path="/check-email" element={<CheckEmailPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/" element={<DashboardPage />} />
    </Routes>
  );
}
