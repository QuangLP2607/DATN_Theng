import { useRef, useState } from "react";
import classNames from "classnames/bind";

import LoginIntro from "./components/LoginIntro";
import LoginForm from "./components/LoginForm";

import authApi from "@/services/auth";
import { useAuth } from "@/app/providers/Auth/useAuth";

import styles from "./Login.module.scss";

const cx = classNames.bind(styles);

export type LoginRole = "student" | "teacher" | "admin";

export interface LoginCredentials {
  email: string;
  password: string;
  role: LoginRole;
}

const LOGIN_ERROR = "Email hoặc mật khẩu không chính xác. Vui lòng thử lại.";

export default function LoginPage() {
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState<LoginRole>("student");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submittingRef = useRef(false);

  const handleLogin = async (credentials: LoginCredentials) => {
    if (submittingRef.current) return;

    submittingRef.current = true;
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await authApi.signIn({
        email: credentials.email,
        password: credentials.password,
      });

      const expectedRole = credentials.role.toUpperCase();

      if (response.user.role !== expectedRole) {
        setErrorMessage(LOGIN_ERROR);
        return;
      }

      // PublicRoute tự điều hướng khi AuthContext cập nhật.
      login(response.accessToken, response.user);
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage(LOGIN_ERROR);
    } finally {
      submittingRef.current = false;
      setIsLoading(false);
    }
  };

  return (
    <main className={cx("login-page")}>
      <div className={cx("container")}>
        <LoginIntro />

        <LoginForm
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
          onLogin={handleLogin}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />
      </div>
    </main>
  );
}
