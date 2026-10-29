import { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";

import DashboardGreeting from "./components/DashboardGreeting";
import RecentUsers from "./components/RecentUsers";
import StatsGrid from "./components/StatsGrid";
import SystemMetrics from "./components/SystemMetrics";
import UserGrowthChart from "./components/UserGrowthChart";

import { useAuth } from "@/app/providers/Auth/useAuth";
import userApi, { type UserListItem } from "@/services/users";

import styles from "./home.module.scss";

const cx = classNames.bind(styles);

const RECENT_USERS_LIMIT = 6;

function getTimestamp(date?: string): number {
  if (!date) {
    return 0;
  }

  const timestamp = new Date(date).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export default function Home() {
  const { user } = useAuth();

  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState("");

  const requestIdRef = useRef(0);

  const fetchRecentUsers = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    setUsersError("");
    setLoadingUsers(true);

    try {
      const response = await userApi.getUsers({
        page: 1,
        limit: RECENT_USERS_LIMIT,
      });

      if (requestId !== requestIdRef.current) {
        return;
      }

      const recentUsers = [...response.users].sort(
        (a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt),
      );

      setUsers(recentUsers.slice(0, RECENT_USERS_LIMIT));
    } catch {
      if (requestId === requestIdRef.current) {
        setUsersError("Không thể tải danh sách người dùng.");
        setUsers([]);
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoadingUsers(false);
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const requestId = ++requestIdRef.current;

    userApi
      .getUsers({
        page: 1,
        limit: RECENT_USERS_LIMIT,
      })
      .then((response) => {
        if (cancelled || requestId !== requestIdRef.current) {
          return;
        }

        const recentUsers = [...response.users].sort(
          (a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt),
        );

        setUsers(recentUsers.slice(0, RECENT_USERS_LIMIT));
      })
      .catch(() => {
        if (!cancelled && requestId === requestIdRef.current) {
          setUsersError("Không thể tải danh sách người dùng.");
        }
      })
      .finally(() => {
        if (!cancelled && requestId === requestIdRef.current) {
          setLoadingUsers(false);
        }
      });

    return () => {
      cancelled = true;
      requestIdRef.current += 1;
    };
  }, []);

  const handleRetry = () => {
    void fetchRecentUsers();
  };

  return (
    <main className={cx("wrapper")}>
      <DashboardGreeting name={user?.name?.trim() || "Người dùng"} />

      <StatsGrid />

      <section className={cx("overview")}>
        <UserGrowthChart />
        <SystemMetrics />
      </section>

      {usersError ? (
        <div className={cx("error")} role="alert">
          <p>{usersError}</p>

          <button type="button" onClick={handleRetry}>
            Thử lại
          </button>
        </div>
      ) : (
        <RecentUsers users={users} loading={loadingUsers} />
      )}
    </main>
  );
}
