import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import classNames from "classnames/bind";

import { useAuth } from "@/app/providers/Auth";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import styles from "./MainLayout.module.scss";

const cx = classNames.bind(styles);

export default function MainLayout() {
  const { user, isSignedIn } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isSignedIn || !user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div
      className={cx("layout", {
        "layout-collapsed": collapsed,
      })}
    >
      {mobileOpen && (
        <button
          type="button"
          aria-label="Đóng menu"
          className={cx("overlay")}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar
        role={user.role}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
        onNavigate={() => setMobileOpen(false)}
      />

      <div className={cx("main")}>
        <Header
          user={user}
          onToggleMenu={() => setMobileOpen((prev) => !prev)}
        />

        <main className={cx("content")}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
