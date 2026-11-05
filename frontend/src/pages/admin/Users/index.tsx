import { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import * as XLSX from "xlsx";

import Pagination from "@/components/Pagination";
import Loading from "@/components/Loading";
import ErrorState from "@/components/ErrorState";
import Modal from "@/components/Modal";

import Stats from "./components/Stats";
import Toolbar from "./components/Toolbar";
import UserList from "./components/UserList";
import AddModal from "./components/AddModal";
import EditModal from "./components/EditModal";

import userApi, {
  type UserListItem,
  type GetUsersResponse,
} from "@/services/users";

import statsApi, { type UserStats } from "@/services/stats";

import type { DataTableSort } from "@/components/DataTable";
import type { Role } from "@/interfaces/user";

import useDebouncedSearch from "@/hooks/useDebouncedSearch";

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
  const [actionLoading, setActionLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [confirmUser, setConfirmUser] = useState<UserListItem | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<RoleFilter>("ALL");
  const [sort, setSort] = useState<DataTableSort | null>(null);

  const requestIdRef = useRef(0);
  const statsRequestIdRef = useRef(0);

  /*
   * ==================== FETCH USERS ====================
   */

  const fetchUsers = useCallback(
    async (
      page: number,
      keyword: string,
      role: RoleFilter,
      currentSort: DataTableSort | null,
    ) => {
      const requestId = ++requestIdRef.current;

      setLoading(true);

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
        setError("");
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

  /*
   * ==================== FETCH STATS ====================
   */

  const fetchStats = useCallback(async () => {
    const requestId = ++statsRequestIdRef.current;

    setStatsLoading(true);

    try {
      const response = await statsApi.getUserStats();

      if (requestId !== statsRequestIdRef.current) return;

      setStats(response);
      setStatsError("");
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

  /*
   * ==================== DEBOUNCED SEARCH ====================
   */

  const debouncedSearch = useDebouncedSearch(
    (keyword: string, role: RoleFilter, currentSort: DataTableSort | null) => {
      void fetchUsers(1, keyword, role, currentSort);
    },
    400,
  );

  /*
   * ==================== INITIAL DATA ====================
   */

  useEffect(() => {
    let cancelled = false;

    const usersRequestId = ++requestIdRef.current;
    const statsRequestId = ++statsRequestIdRef.current;

    const loadUsers = async () => {
      try {
        const response = await userApi.getUsers({
          page: 1,
          limit: PAGE_SIZE,
        });

        if (cancelled || usersRequestId !== requestIdRef.current) return;

        setUsers(response.users);
        setResult(response);
        setCurrentPage(response.pagination.page);
        setError("");
      } catch {
        if (!cancelled && usersRequestId === requestIdRef.current) {
          setError("Không thể tải danh sách người dùng.");
        }
      } finally {
        if (!cancelled && usersRequestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    };

    const loadStats = async () => {
      try {
        const response = await statsApi.getUserStats();

        if (cancelled || statsRequestId !== statsRequestIdRef.current) return;

        setStats(response);
        setStatsError("");
      } catch {
        if (!cancelled && statsRequestId === statsRequestIdRef.current) {
          setStatsError("Không thể tải thống kê người dùng.");
        }
      } finally {
        if (!cancelled && statsRequestId === statsRequestIdRef.current) {
          setStatsLoading(false);
        }
      }
    };

    void loadUsers();
    void loadStats();

    return () => {
      cancelled = true;

      requestIdRef.current += 1;
      statsRequestIdRef.current += 1;

      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  /*
   * ==================== SEARCH ====================
   */

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);

    debouncedSearch(value, selectedRole, sort);
  };

  /*
   * ==================== FILTER ====================
   */

  const handleRoleChange = (role: RoleFilter) => {
    debouncedSearch.cancel();

    setSelectedRole(role);
    setCurrentPage(1);

    void fetchUsers(1, search, role, sort);
  };

  /*
   * ==================== SORT ====================
   */

  const handleSortChange = (nextSort: DataTableSort | null) => {
    debouncedSearch.cancel();

    setSort(nextSort);
    setCurrentPage(1);

    void fetchUsers(1, search, selectedRole, nextSort);
  };

  /*
   * ==================== PAGINATION ====================
   */

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

  /*
   * ==================== RETRY ====================
   */

  const handleRetryUsers = () => {
    void fetchUsers(currentPage, search, selectedRole, sort);
  };

  const handleRetryStats = () => {
    void fetchStats();
  };

  /*
   * ==================== ADD USER ====================
   */

  const handleAddUserSuccess = () => {
    void Promise.all([
      fetchUsers(currentPage, search, selectedRole, sort),
      fetchStats(),
    ]);
  };

  /*
   * ==================== EDIT USER ====================
   */

  const handleEditUser = (user: UserListItem) => {
    setSelectedUser(user);
  };

  const handleEditSuccess = () => {
    void Promise.all([
      fetchUsers(currentPage, search, selectedRole, sort),
      fetchStats(),
    ]);
  };

  /*
   * ==================== TOGGLE USER STATUS ====================
   */

  const handleToggleStatus = (user: UserListItem) => {
    setConfirmUser(user);
  };

  const handleConfirmToggleStatus = async () => {
    if (!confirmUser || actionLoading) return;

    setActionLoading(true);

    try {
      const nextStatus =
        confirmUser.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

      await userApi.updateUser(confirmUser.id, {
        status: nextStatus,
      });

      setConfirmUser(null);

      await Promise.all([
        fetchUsers(currentPage, search, selectedRole, sort),
        fetchStats(),
      ]);
    } catch {
      window.alert("Không thể cập nhật trạng thái người dùng.");
    } finally {
      setActionLoading(false);
    }
  };

  /*
   * ==================== EXPORT EXCEL ====================
   */

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

  /*
   * ==================== RENDER ====================
   */

  return (
    <main className={cx("wrapper")}>
      {/* STATS */}
      <section className={cx("stats-container")}>
        <Stats
          totalUsers={stats.totalUsers}
          teachers={stats.totalTeachers}
          students={stats.totalStudents}
        />

        {statsError && (
          <ErrorState
            message={statsError}
            onRetry={handleRetryStats}
            loading={statsLoading}
          />
        )}
      </section>

      {/* TOOLBAR */}
      <Toolbar
        search={search}
        selectedRole={selectedRole}
        onSearchChange={handleSearchChange}
        onRoleChange={handleRoleChange}
        onAddUser={() => setShowAddModal(true)}
        onExport={handleExport}
      />

      {exporting && (
        <p role="status" aria-live="polite">
          Đang chuẩn bị file Excel...
        </p>
      )}

      {/* USER LIST */}
      <section className={cx("list-container")}>
        {loading && !result ? (
          <Loading />
        ) : (
          <UserList
            users={users}
            loading={false}
            sort={sort}
            onSortChange={handleSortChange}
            onEdit={handleEditUser}
            onToggleStatus={handleToggleStatus}
          />
        )}

        {error && (
          <ErrorState
            message={error}
            onRetry={handleRetryUsers}
            loading={loading}
          />
        )}
      </section>

      {/* PAGINATION */}
      {result && result.pagination.total > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={result.pagination.totalPages}
          totalItems={result.pagination.total}
          pageSize={result.pagination.limit}
          itemLabel="người dùng"
          ariaLabel="Phân trang người dùng"
          onPageChange={handlePageChange}
        />
      )}

      {/* ADD USER MODAL */}
      {showAddModal && (
        <AddModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddUserSuccess}
        />
      )}

      {/* EDIT USER MODAL */}
      {selectedUser && (
        <EditModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* CONFIRM TOGGLE STATUS MODAL */}
      {confirmUser && (
        <Modal
          title={
            confirmUser.status === "ACTIVE"
              ? "Khóa tài khoản"
              : "Mở khóa tài khoản"
          }
          description={
            confirmUser.status === "ACTIVE"
              ? `Bạn có chắc muốn khóa tài khoản "${confirmUser.name}"? Người dùng sẽ không thể đăng nhập cho đến khi được mở khóa.`
              : `Bạn có chắc muốn mở khóa tài khoản "${confirmUser.name}"? Người dùng sẽ có thể đăng nhập và sử dụng hệ thống trở lại.`
          }
          onClose={() => setConfirmUser(null)}
          loading={actionLoading}
        >
          <div className={cx("modal-actions")}>
            <button
              type="button"
              className={cx("cancel-button")}
              onClick={() => setConfirmUser(null)}
              disabled={actionLoading}
            >
              Hủy
            </button>

            <button
              type="button"
              className={cx(
                "confirm-button",
                confirmUser.status === "ACTIVE" ? "danger" : "primary",
              )}
              onClick={handleConfirmToggleStatus}
              disabled={actionLoading}
            >
              {actionLoading
                ? "Đang xử lý..."
                : confirmUser.status === "ACTIVE"
                  ? "Khóa tài khoản"
                  : "Mở khóa"}
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
}
