import { Routes, Route } from "react-router-dom";

import { UpdatePasswordPage } from "./pages/auth/UpdatePasswordPage";
import { VerifyEmailPage } from "./pages/auth/VerifyEmailPage";
import { UpdateEmailPage } from "./pages/auth/UpdateEmailPage";
import { ValidateUpdateEmailPage } from "./pages/auth/ValidateUpdateEmailPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ContentPage } from "./pages/ContentPage";
import { ProfilePage } from "./pages/auth/ProfilePage";
import { UsersPage } from "./pages/form/UsersPage";
import { TabCreatePage } from "./pages/form/TabCreatePage";
import { TabEditPage } from "./pages/form/TabEditPage";
import { useLocation } from "react-router-dom";
import { Layout } from "./components/routing/Layout";

export default function Router() {
  const location = useLocation();
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/users" element={<UsersPage />} />
        <Route path="/account" element={<ProfilePage />} />
        <Route path="/update-password" element={<UpdatePasswordPage />} />
        <Route path="/validate-update-email" element={<ValidateUpdateEmailPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/update-email" element={<UpdateEmailPage />} />
        <Route path="/form/tab" element={<TabCreatePage />} />
        <Route path="/form/tab/:id" element={<TabEditPage key={location.pathname} />} />
        <Route path="/" element={<DashboardPage />} />
        <Route path="/*" element={<ContentPage key={location.pathname} />} />
      </Route>
    </Routes>
  );
}
