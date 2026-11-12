import { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";

import Pagination from "@/components/Pagination";
import Loading from "@/components/Loading";
import ErrorState from "@/components/ErrorState";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import type { DataTableSort } from "@/components/DataTable";

import courseApi, { type CourseListItem } from "@/services/course";
import classApi, {
  type ClassListItem,
  type ClassSortBy,
} from "@/services/class";

import type { ClassStatus } from "@/interfaces/class";
import type { SortOrder } from "@/interfaces/common";

import useDebouncedSearch from "@/hooks/useDebouncedSearch";

import Toolbar, {
  type ClassSortOption,
  type ClassStatusFilter,
} from "./components/Toolbar";

import ClassTable from "./components/ClassTable";
import ClassModal from "./components/ClassModal";

import styles from "./Classes.module.scss";

const cx = classNames.bind(styles);

const PAGE_SIZE = 10;

const INITIAL_SORT: ClassSortOption = "newest";

const SORT_CONFIG: Record<
  ClassSortOption,
  {
    sortBy: ClassSortBy;
    order: SortOrder;
  }
> = {
  newest: {
    sortBy: "createdAt",
    order: "desc",
  },
  oldest: {
    sortBy: "createdAt",
    order: "asc",
  },
  nameAsc: {
    sortBy: "name",
    order: "asc",
  },
  nameDesc: {
    sortBy: "name",
    order: "desc",
  },
};

const TABLE_SORT_CONFIG: Record<
  string,
  {
    sortBy: ClassSortBy;
    order: SortOrder;
  }
> = {
  name: {
    sortBy: "name",
    order: "asc",
  },
  startAt: {
    sortBy: "startAt",
    order: "asc",
  },
};

interface ClassListResult {
  classes: ClassListItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function Classes() {
  const [classes, setClasses] = useState<ClassListItem[]>([]);
  const [result, setResult] = useState<ClassListResult | null>(null);
  const [courses, setCourses] = useState<CourseListItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [courseLoading, setCourseLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassListItem | null>(
    null,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<ClassSortOption>(INITIAL_SORT);
  const [tableSort, setTableSort] = useState<DataTableSort | null>(null);
  const [courseId, setCourseId] = useState("");
  const [status, setStatus] = useState<ClassStatusFilter>("ALL");

  const requestIdRef = useRef(0);

  const fetchClasses = useCallback(
    async (
      page: number,
      keyword: string,
      sortOption: ClassSortOption,
      selectedCourseId: string,
      statusFilter: ClassStatusFilter,
      tableSortOption?: DataTableSort | null,
    ) => {
      const requestId = ++requestIdRef.current;

      setLoading(true);
      setError("");

      try {
        const tableSortConfig = tableSortOption
          ? TABLE_SORT_CONFIG[tableSortOption.key]
          : undefined;

        const { sortBy, order } = tableSortConfig ?? SORT_CONFIG[sortOption];

        const response = await classApi.getClasses({
          page,
          limit: PAGE_SIZE,
          search: keyword.trim() || undefined,
          sortBy,
          order,
          courseId: selectedCourseId || undefined,
          status:
            statusFilter === "ALL" ? undefined : (statusFilter as ClassStatus),
        });

        if (requestId !== requestIdRef.current) return;

        setClasses(response.classes);
        setResult(response);
        setCurrentPage(response.pagination.page);
      } catch {
        if (requestId === requestIdRef.current) {
          setError("Không thể tải danh sách lớp học.");
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [],
  );

  const debouncedSearch = useDebouncedSearch(
    (
      keyword: string,
      sortOption: ClassSortOption,
      selectedCourseId: string,
      statusFilter: ClassStatusFilter,
    ) => {
      void fetchClasses(
        1,
        keyword,
        sortOption,
        selectedCourseId,
        statusFilter,
        null,
      );
    },
    400,
  );

  useEffect(() => {
    let cancelled = false;
    const requestId = ++requestIdRef.current;

    const loadClasses = async () => {
      try {
        const { sortBy, order } = SORT_CONFIG[INITIAL_SORT];

        const response = await classApi.getClasses({
          page: 1,
          limit: PAGE_SIZE,
          sortBy,
          order,
        });

        if (cancelled || requestId !== requestIdRef.current) return;

        setClasses(response.classes);
        setResult(response);
        setCurrentPage(response.pagination.page);
        setError("");
      } catch {
        if (!cancelled && requestId === requestIdRef.current) {
          setError("Không thể tải danh sách lớp học.");
        }
      } finally {
        if (!cancelled && requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    };

    void loadClasses();

    return () => {
      cancelled = true;
      requestIdRef.current += 1;
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    let cancelled = false;

    const loadCourses = async () => {
      try {
        const response = await courseApi.getCourses({
          page: 1,
          limit: 100,
          sortBy: "title",
          order: "asc",
        });

        if (!cancelled) {
          setCourses(response.courses);
        }
      } catch {
        if (!cancelled) {
          setCourses([]);
        }
      } finally {
        if (!cancelled) {
          setCourseLoading(false);
        }
      }
    };

    void loadCourses();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
    setTableSort(null);

    debouncedSearch.cancel();
    debouncedSearch(value, sort, courseId, status);
  };

  const handleSortChange = (value: ClassSortOption) => {
    debouncedSearch.cancel();

    setSort(value);
    setTableSort(null);
    setCurrentPage(1);

    void fetchClasses(1, search, value, courseId, status, null);
  };

  const handleTableSortChange = (value: DataTableSort | null) => {
    debouncedSearch.cancel();

    setTableSort(value);
    setCurrentPage(1);

    void fetchClasses(1, search, sort, courseId, status, value);
  };

  const handleCourseChange = (value: string) => {
    debouncedSearch.cancel();

    setCourseId(value);
    setTableSort(null);
    setCurrentPage(1);

    void fetchClasses(1, search, sort, value, status, null);
  };

  const handleStatusChange = (value: ClassStatusFilter) => {
    debouncedSearch.cancel();

    setStatus(value);
    setTableSort(null);
    setCurrentPage(1);

    void fetchClasses(1, search, sort, courseId, value, null);
  };

  const handleClearFilters = () => {
    debouncedSearch.cancel();

    setCourseId("");
    setStatus("ALL");
    setTableSort(null);
    setCurrentPage(1);

    void fetchClasses(1, search, sort, "", "ALL", null);
  };

  const handlePageChange = useCallback(
    (page: number) => {
      const totalPages = result?.pagination.totalPages ?? 1;

      if (page < 1 || page > totalPages || page === currentPage) {
        return;
      }

      debouncedSearch.cancel();
      setCurrentPage(page);

      void fetchClasses(page, search, sort, courseId, status, tableSort);
    },
    [
      result?.pagination.totalPages,
      currentPage,
      debouncedSearch,
      fetchClasses,
      search,
      sort,
      courseId,
      status,
      tableSort,
    ],
  );

  const handleRetry = () => {
    void fetchClasses(currentPage, search, sort, courseId, status, tableSort);
  };

  const handleOpenCreateModal = () => {
    setSelectedClass(null);
    setShowModal(true);
  };

  const handleEdit = (item: ClassListItem) => {
    setSelectedClass(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedClass(null);
  };

  const handleSuccess = () => {
    void fetchClasses(currentPage, search, sort, courseId, status, tableSort);
  };

  const handleDelete = async (item: ClassListItem) => {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa lớp "${item.name}" không?`,
    );

    if (!confirmed) return;

    try {
      await classApi.deleteClass(item.id);

      const nextPage =
        classes.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;

      void fetchClasses(nextPage, search, sort, courseId, status, tableSort);
    } catch {
      setError("Không thể xóa lớp học. Vui lòng thử lại.");
    }
  };

  return (
    <main className={cx("wrapper")}>
      <PageBreadcrumb items={[{ label: "Quản lý" }, { label: "Lớp học" }]} />

      <Toolbar
        search={search}
        sort={sort}
        courseId={courseId}
        status={status}
        courses={courses}
        courseLoading={courseLoading}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onCourseChange={handleCourseChange}
        onStatusChange={handleStatusChange}
        onClearFilters={handleClearFilters}
        onAddClass={handleOpenCreateModal}
      />

      <section className={cx("list-container")}>
        {loading && !result ? (
          <Loading />
        ) : (
          <ClassTable
            classes={classes}
            loading={loading}
            sort={tableSort}
            onSortChange={handleTableSortChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {error && (
          <ErrorState message={error} onRetry={handleRetry} loading={loading} />
        )}
      </section>

      {result && result.pagination.total > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={result.pagination.totalPages}
          totalItems={result.pagination.total}
          pageSize={result.pagination.limit}
          itemLabel="lớp học"
          ariaLabel="Phân trang lớp học"
          onPageChange={handlePageChange}
        />
      )}

      {showModal && (
        <ClassModal
          key={selectedClass?.id ?? "create"}
          classItem={selectedClass}
          courses={courses}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </main>
  );
}
