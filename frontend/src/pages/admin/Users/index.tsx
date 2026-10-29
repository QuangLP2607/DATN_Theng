import { useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import classNames from "classnames/bind";

import Pagination from "./components/Pagination";
import Stats from "./components/Stats";
import Toolbar from "./components/Toolbar";
import UserList from "./components/UserList";
import AddUserModal from "./components/AddUserModal";

import userApi, {
  type UserListItem,
  type GetUsersResponse,
} from "@/services/users";

import type { Role } from "@/interfaces/user";

import styles from "./Users.module.scss";

const cx = classNames.bind(styles);

const PAGE_SIZE = 10;

type RoleFilter = Role | "ALL";

export default function Users() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [result, setResult] = useState<GetUsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<RoleFilter>("ALL");

  const requestIdRef = useRef(0);

  const fetchUsers = useCallback(
    async (page: number, keyword: string, role: RoleFilter) => {
      const requestId = ++requestIdRef.current;

      setLoading(true);
      setError("");

      try {
        const response = await userApi.getUsers({
          page,
          limit: PAGE_SIZE,
          search: keyword.trim() || undefined,
          role: role === "ALL" ? undefined : role,
        });

        if (requestId !== requestIdRef.current) return;

        setUsers(response.users);
        setResult(response);
        setCurrentPage(response.pagination.page);
      } catch {
        if (requestId === requestIdRef.current) {
          setError("Không thể tải danh sách người dùng.");
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [],
  );

  const debouncedSearch = useDebouncedCallback((keyword: string) => {
    void fetchUsers(1, keyword, selectedRole);
  }, 400);

  useEffect(() => {
    let cancelled = false;
    const requestId = ++requestIdRef.current;

    userApi
      .getUsers({ page: 1, limit: PAGE_SIZE })
      .then((response) => {
        if (cancelled || requestId !== requestIdRef.current) return;

        setUsers(response.users);
        setResult(response);
        setCurrentPage(response.pagination.page);
      })
      .catch(() => {
        if (!cancelled && requestId === requestIdRef.current) {
          setError("Không thể tải danh sách người dùng.");
        }
      })
      .finally(() => {
        if (!cancelled && requestId === requestIdRef.current) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
    debouncedSearch(value);
  };

  const handleRoleChange = (role: RoleFilter) => {
    debouncedSearch.cancel();
    setSelectedRole(role);
    setCurrentPage(1);

    void fetchUsers(1, search, role);
  };

  const handlePageChange = (page: number) => {
    const totalPages = result?.pagination.totalPages ?? 1;

    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    debouncedSearch.cancel();
    setCurrentPage(page);
    void fetchUsers(page, search, selectedRole);
  };

  const handleRetry = () => {
    void fetchUsers(currentPage, search, selectedRole);
  };

  const handleAddUserSuccess = () => {
    void fetchUsers(currentPage, search, selectedRole);
  };

  return (
    <main className={cx("wrapper")}>
      <Stats totalUsers={0} teachers={0} students={0} />

      <Toolbar
        search={search}
        selectedRole={selectedRole}
        onSearchChange={handleSearchChange}
        onRoleChange={handleRoleChange}
        onAddUser={() => setShowAddUserModal(true)}
      />

      {error ? (
        <div role="alert">
          <p>{error}</p>
          <button type="button" onClick={handleRetry}>
            Thử lại
          </button>
        </div>
      ) : (
        <>
          <UserList users={users} loading={loading} />

          {!loading && result && result.pagination.total > 0 && (
            <Pagination
              currentPage={result.pagination.page}
              totalPages={result.pagination.totalPages}
              totalItems={result.pagination.total}
              pageSize={result.pagination.limit}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {showAddUserModal && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
          onSuccess={handleAddUserSuccess}
        />
      )}
    </main>
  );
}
