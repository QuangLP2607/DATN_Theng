import { useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import classNames from "classnames/bind";
import * as XLSX from "xlsx";

import Pagination from "./components/Pagination";
import Stats from "./components/Stats";
import Toolbar from "./components/Toolbar";
import UserList from "./components/UserList";
import AddUserModal from "./components/AddUserModal";

import userApi, {
  type UserListItem,
  type GetUsersResponse,
} from "@/services/users";
import statsApi, { type UserStats } from "@/services/stats";
import type { DataTableSort } from "@/components/DataTable";
import type { Role } from "@/interfaces/user";

import styles from "./Users.module.scss";

const cx = classNames.bind(styles);

const PAGE_SIZE = 10;
const EXPORT_PAGE_SIZE = 100;

type RoleFilter = Role | "ALL";

const INITIAL_STATS: UserStats = {
  totalUsers: 0,
  totalTeachers: 0,
  totalStudents: 0,
};

export default function Users() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [result, setResult] = useState<GetUsersResponse | null>(null);
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);

  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState("");
  const [statsError, setStatsError] = useState("");
  const [exporting, setExporting] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<RoleFilter>("ALL");
  const [sort, setSort] = useState<DataTableSort | null>(null);

  const requestIdRef = useRef(0);
  const statsRequestIdRef = useRef(0);

  const fetchUsers = useCallback(
    async (
      page: number,
      keyword: string,
      role: RoleFilter,
      currentSort: DataTableSort | null,
    ) => {
      const requestId = ++requestIdRef.current;

      setLoading(true);
      setError("");

      try {
        const response = await userApi.getUsers({
          page,
          limit: PAGE_SIZE,
          search: keyword.trim() || undefined,
          role: role === "ALL" ? undefined : role,
          sortBy: currentSort?.key === "createdAt" ? "createdAt" : undefined,
          sortOrder:
            currentSort?.key === "createdAt"
              ? currentSort.direction
              : undefined,
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

  const fetchStats = useCallback(async () => {
    const requestId = ++statsRequestIdRef.current;

    setStatsLoading(true);
    setStatsError("");

    try {
      const response = await statsApi.getUserStats();

      if (requestId !== statsRequestIdRef.current) return;

      setStats(response);
    } catch {
      if (requestId === statsRequestIdRef.current) {
        setStatsError("Không thể tải thống kê người dùng.");
      }
    } finally {
      if (requestId === statsRequestIdRef.current) {
        setStatsLoading(false);
      }
    }
  }, []);

  const debouncedSearch = useDebouncedCallback(
    (keyword: string, role: RoleFilter, currentSort: DataTableSort | null) => {
      void fetchUsers(1, keyword, role, currentSort);
    },
    400,
  );

  useEffect(() => {
    let cancelled = false;
    const requestId = ++requestIdRef.current;

    userApi
      .getUsers({
        page: 1,
        limit: PAGE_SIZE,
      })
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
      requestIdRef.current += 1;
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    let cancelled = false;

    statsApi
      .getUserStats()
      .then((response) => {
        if (!cancelled) {
          setStats(response);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatsError("Không thể tải thống kê người dùng.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
    debouncedSearch(value, selectedRole, sort);
  };

  const handleRoleChange = (role: RoleFilter) => {
    debouncedSearch.cancel();
    setSelectedRole(role);
    setCurrentPage(1);

    void fetchUsers(1, search, role, sort);
  };

  const handleSortChange = (nextSort: DataTableSort | null) => {
    debouncedSearch.cancel();
    setSort(nextSort);
    setCurrentPage(1);

    void fetchUsers(1, search, selectedRole, nextSort);
  };

  const handlePageChange = useCallback(
    (page: number) => {
      const totalPages = result?.pagination.totalPages ?? 1;

      if (page < 1 || page > totalPages || page === currentPage) {
        return;
      }

      debouncedSearch.cancel();
      setCurrentPage(page);

      void fetchUsers(page, search, selectedRole, sort);
    },
    [
      result?.pagination.totalPages,
      currentPage,
      debouncedSearch,
      fetchUsers,
      search,
      selectedRole,
      sort,
    ],
  );

  const handleRetry = () => {
    void fetchUsers(currentPage, search, selectedRole, sort);
  };

  const handleAddUserSuccess = () => {
    void Promise.all([
      fetchUsers(currentPage, search, selectedRole, sort),
      fetchStats(),
    ]);
  };

  const handleExport = async () => {
    if (exporting) return;

    setExporting(true);

    try {
      const params = {
        limit: EXPORT_PAGE_SIZE,
        search: search.trim() || undefined,
        role: selectedRole === "ALL" ? undefined : selectedRole,
      };

      const firstResponse = await userApi.getUsers({
        ...params,
        page: 1,
      });

      const allUsers = [...firstResponse.users];
      const totalPages = firstResponse.pagination.totalPages;

      for (let page = 2; page <= totalPages; page += 1) {
        const response = await userApi.getUsers({
          ...params,
          page,
        });

        allUsers.push(...response.users);
      }

      if (allUsers.length === 0) {
        window.alert("Không có dữ liệu để xuất Excel.");
        return;
      }

      const rows = allUsers.map((user, index) => ({
        STT: index + 1,
        "Họ và tên": user.name,
        Email: user.email,
        "Vai trò":
          user.role === "TEACHER"
            ? "Giáo viên"
            : user.role === "STUDENT"
              ? "Học sinh"
              : "Quản trị viên",
        "Trạng thái":
          user.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động",
        "Ngày tham gia": user.createdAt
          ? new Date(user.createdAt).toLocaleDateString("vi-VN")
          : "",
        Lớp: user.classCount ?? 0,
      }));

      const worksheet = XLSX.utils.json_to_sheet(rows);

      worksheet["!cols"] = [
        { wch: 8 },
        { wch: 28 },
        { wch: 32 },
        { wch: 18 },
        { wch: 20 },
        { wch: 18 },
        { wch: 12 },
      ];

      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Người dùng");

      const date = new Date().toISOString().slice(0, 10);

      XLSX.writeFile(workbook, `danh-sach-nguoi-dung-${date}.xlsx`);
    } catch {
      window.alert("Không thể xuất Excel. Vui lòng thử lại.");
    } finally {
      setExporting(false);
    }
  };

  const hasUsers = users.length > 0;
  const showTable = !error || hasUsers || loading;

  return (
    <main className={cx("wrapper")}>
      <Stats
        totalUsers={stats.totalUsers}
        teachers={stats.totalTeachers}
        students={stats.totalStudents}
      />

      {statsError && (
        <div role="alert">
          <p>{statsError}</p>
          <button
            type="button"
            onClick={() => void fetchStats()}
            disabled={statsLoading}
          >
            Thử tải lại thống kê
          </button>
        </div>
      )}

      <Toolbar
        search={search}
        selectedRole={selectedRole}
        onSearchChange={handleSearchChange}
        onRoleChange={handleRoleChange}
        onAddUser={() => setShowAddUserModal(true)}
        onExport={handleExport}
      />

      {exporting && (
        <p role="status" aria-live="polite">
          Đang chuẩn bị file Excel...
        </p>
      )}

      {error && (
        <div role="alert">
          <p>{error}</p>
          <button type="button" onClick={handleRetry}>
            Thử lại
          </button>
        </div>
      )}

      {showTable && (
        <>
          <UserList
            users={users}
            loading={loading && users.length === 0}
            sort={sort}
            onSortChange={handleSortChange}
          />

          {result && result.pagination.total > 0 && (
            <Pagination
              currentPage={currentPage}
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
