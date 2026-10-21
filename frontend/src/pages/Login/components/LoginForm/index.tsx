import { useState, type FormEvent } from "react";
import classNames from "classnames/bind";

import Icon from "@/components/Icon";
import type { LoginCredentials, LoginRole } from "../../index";
import styles from "./LoginForm.module.scss";

const cx = classNames.bind(styles);

interface LoginFormProps {
  selectedRole: LoginRole;
  onRoleChange: (role: LoginRole) => void;
  onLogin: (credentials: LoginCredentials) => void;
  isLoading: boolean;
  errorMessage: string;
}

const roles: {
  value: LoginRole;
  label: string;
  icon: string;
  title: string;
  description: string;
}[] = [
  {
    value: "student",
    label: "Học sinh",
    icon: "icons8:student",
    title: "Chào mừng bạn trở lại",
    description: "Đăng nhập để tiếp tục lớp học và theo dõi tiến độ của bạn.",
  },
  {
    value: "teacher",
    label: "Giáo viên",
    icon: "vadivam:book-open",
    title: "Cổng thông tin giáo viên",
    description: "Quản lý lớp học, nội dung giảng dạy và kết quả học tập.",
  },
  {
    value: "admin",
    label: "Quản trị",
    icon: "settings",
    title: "Quản trị hệ thống",
    description: "Đăng nhập bằng tài khoản quản trị được nhà trường cấp.",
  },
];

export default function LoginForm({
  selectedRole,
  onRoleChange,
  onLogin,
  isLoading,
  errorMessage,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const activeRole = roles.find((role) => role.value === selectedRole)!;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoading) return;

    onLogin({
      email: email.trim(),
      password,
      role: selectedRole,
    });
  };

  return (
    <section className={cx("login-form")}>
      <header className={cx("login-form__header")}>
        <h2 className={cx("login-form__title")}>{activeRole.title}</h2>

        <p className={cx("login-form__subtitle")}>{activeRole.description}</p>
      </header>

      <div
        className={cx("login-form__role-selector")}
        role="group"
        aria-label="Chọn vai trò đăng nhập"
      >
        {roles.map((role) => (
          <button
            key={role.value}
            type="button"
            className={cx("login-form__role-option", {
              "login-form__role-option--active": selectedRole === role.value,
            })}
            aria-pressed={selectedRole === role.value}
            onClick={() => onRoleChange(role.value)}
            disabled={isLoading}
          >
            <Icon name={role.icon} />
            <span>{role.label}</span>
          </button>
        ))}
      </div>

      <form className={cx("login-form__form")} onSubmit={handleSubmit}>
        <div className={cx("login-form__group")}>
          <label className={cx("login-form__label")} htmlFor="login-email">
            Email
          </label>

          <div className={cx("login-form__input-wrapper")}>
            <Icon name="boxicons:user" />

            <input
              id="login-email"
              className={cx("login-form__input")}
              type="email"
              name="email"
              placeholder="yourname@edu.vn"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div className={cx("login-form__group")}>
          <label className={cx("login-form__label")} htmlFor="login-password">
            Mật khẩu
          </label>

          <div className={cx("login-form__input-wrapper")}>
            <Icon name="carbon:password" />

            <input
              id="login-password"
              className={cx("login-form__input")}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isLoading}
              required
            />

            <button
              className={cx("login-form__password-toggle")}
              type="button"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              onClick={() => setShowPassword((current) => !current)}
              disabled={isLoading}
            >
              <Icon name={showPassword ? "eye-off" : "eye"} />
            </button>
          </div>
        </div>

        {/* Luôn giữ nguyên vùng hiển thị message */}
        <div className={cx("login-form__error-slot")}>
          <p
            className={cx("login-form__error", {
              "login-form__error--visible": Boolean(errorMessage),
            })}
            role={errorMessage ? "alert" : undefined}
            aria-hidden={!errorMessage}
          >
            {errorMessage || "\u00A0"}
          </p>
        </div>

        <button
          className={cx("login-form__submit-button")}
          type="submit"
          disabled={isLoading}
        >
          <span className={cx("login-form__submit-text")}>
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </span>

          <span className={cx("login-form__submit-icon")}>
            <Icon name="chevron-right" />
          </span>
        </button>
      </form>

      <footer className={cx("login-form__footer")}>
        Bằng việc đăng nhập, bạn đồng ý tuân thủ quy định sử dụng hệ thống của
        nhà trường.
      </footer>
    </section>
  );
}
