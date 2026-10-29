import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import Select, { type SelectOption } from "@/components/Select";
import type { Role } from "@/interfaces/user";

import styles from "./Toolbar.module.scss";

const cx = classNames.bind(styles);

export type RoleFilter = Role | "ALL";

interface ToolbarProps {
  search: string;
  selectedRole: RoleFilter;
  onSearchChange: (value: string) => void;
  onRoleChange: (role: RoleFilter) => void;
  onAddUser: () => void;
  onExport?: () => void;
}

const roleFilters: SelectOption<RoleFilter>[] = [
  { label: "Tất cả vai trò", value: "ALL" },
  { label: "Giáo viên", value: "TEACHER" },
  { label: "Học sinh", value: "STUDENT" },
  { label: "Admin", value: "ADMIN" },
];

export default function Toolbar({
  search,
  selectedRole,
  onSearchChange,
  onRoleChange,
  onAddUser,
  onExport,
}: ToolbarProps) {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("search-wrapper")}>
        <Icon
          className={cx("search-icon")}
          icon="lucide:search"
          aria-hidden="true"
        />

        <input
          className={cx("search")}
          type="search"
          placeholder="Tìm theo tên hoặc email..."
          aria-label="Tìm người dùng"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className={cx("role-filter")}>
        <Select<RoleFilter>
          options={roleFilters}
          value={selectedRole}
          onChange={onRoleChange}
          ariaLabel="Lọc theo vai trò"
          placeholder="Tất cả vai trò"
          leadingIcon="lucide:sliders-horizontal"
          fullWidth
        />
      </div>

      <div className={cx("actions")}>
        <button className={cx("add-button")} type="button" onClick={onAddUser}>
          <Icon icon="lucide:plus" aria-hidden="true" />
          <span>Thêm người dùng</span>
        </button>

        <button
          className={cx("export-button")}
          type="button"
          onClick={onExport}
          disabled={!onExport}
        >
          <Icon icon="lucide:download" aria-hidden="true" />
          <span>Xuất Excel</span>
        </button>
      </div>
    </div>
  );
}
