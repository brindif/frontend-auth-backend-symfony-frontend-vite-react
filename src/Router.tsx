import { Routes, Route } from "react-router-dom";

import { UpdatePasswordPage } from "./pages/auth/UpdatePasswordPage";
import { VerifyEmailPage } from "./pages/auth/VerifyEmailPage";
import { UpdateEmailPage } from "./pages/auth/UpdateEmailPage";
import { ValidateUpdateEmailPage } from "./pages/auth/ValidateUpdateEmailPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProfilePage } from "./pages/auth/ProfilePage";
import { TabCreatePage } from "./pages/form/TabCreatePage";
import { TabEditPage } from "./pages/form/TabEditPage";

export default function Router() {
  return (
    <Routes>
      <Route path="/account" element={<ProfilePage />} />
      <Route path="/update-password" element={<UpdatePasswordPage />} />
      <Route path="/validate-update-email" element={<ValidateUpdateEmailPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/update-email" element={<UpdateEmailPage />} />
      <Route path="/form/tab" element={<TabCreatePage />} />
      <Route path="/form/tab/:id" element={<TabEditPage />} />
      <Route path="/" element={<DashboardPage />} />
    </Routes>
  );
}
