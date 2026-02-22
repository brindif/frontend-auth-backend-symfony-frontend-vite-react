import { Routes, Route } from "react-router-dom";
import { UpdatePasswordPage } from "./pages/auth/UpdatePasswordPage";
import { VerifyEmailPage } from "./pages/auth/VerifyEmailPage";
import { UpdateEmailPage } from "./pages/auth/UpdateEmailPage";
import { ValidateUpdateEmailPage } from "./pages/auth/ValidateUpdateEmailPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ContentPage } from "./pages/ContentPage";
import { ProfilePage } from "./pages/auth/ProfilePage";
import { UsersPage } from "./pages/form/UsersPage";
import { SchemasPage } from "./pages/form/SchemasPage";
import { TabCreatePage } from "./pages/form/TabCreatePage";
import { TabEditPage } from "./pages/form/TabEditPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { useLocation } from "react-router-dom";
import { Layout } from "./components/routing/Layout";
import { useAppSelector } from "./store/hooks";
import { selectCurrentUser } from "./store/auth/selectors";
import { RoleType } from "./store/auth/slice";

export default function Router() {
  const location = useLocation();
  const user = useAppSelector(selectCurrentUser);
  return (
    <Routes>
      <Route element={<Layout />}>
        {user && (!user?.roles.includes(RoleType.guest) || user?.roles.length > 1) &&
          <Route path="/schemas" element={<SchemasPage />} />}
        {user && user?.roles.includes(RoleType.admin) && <Route path="/users" element={<UsersPage />} />}
        {!user && <Route path="/login" element={<LoginPage />} />}
        {!user && <Route path="/register" element={<RegisterPage />} />}
        {!user && <Route path="/forgot-password" element={<ForgotPasswordPage />} />}
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
