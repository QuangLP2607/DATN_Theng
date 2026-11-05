import { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";

import Pagination from "@/components/Pagination";
import Loading from "@/components/Loading";
import ErrorState from "@/components/ErrorState";
import type { DataTableSort } from "@/components/DataTable";

import Toolbar from "./components/Toolbar";
import ClassList from "./components/ClassList";
import AddModal from "./components/AddModal";

import classApi, {
  type ClassListItem,
  type ClassSortBy,
  type GetClassesResponse,
} from "@/services/class";

import subjectApi, { type SubjectListItem } from "@/services/subject";

import type { ClassStatus } from "@/interfaces/class";

import useDebouncedSearch from "@/hooks/useDebouncedSearch";

import styles from "./Classes.module.scss";

const cx = classNames.bind(styles);

const PAGE_SIZE = 6;

type StatusFilter = ClassStatus | "ALL";

const DEFAULT_SORT: DataTableSort = {
  key: "createdAt",
  direction: "desc",
};

export default function Classes() {
  const [classes, setClasses] = useState<ClassListItem[]>([]);
  const [result, setResult] = useState<GetClassesResponse | null>(null);
  const [subjects, setSubjects] = useState<SubjectListItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassListItem | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [sort, setSort] = useState<DataTableSort | null>(DEFAULT_SORT);

  const requestIdRef = useRef(0);

  /*
   * ==================== FETCH CLASSES ====================
   */

  const fetchClasses = useCallback(
    async (
      page: number,
      keyword: string,
      currentSubjectId: string,
      currentStatus: StatusFilter,
      currentSort: DataTableSort | null,
    ) => {
      const requestId = ++requestIdRef.current;

      setLoading(true);

      try {
        const response = await classApi.getClasses({
          page,
          limit: PAGE_SIZE,
          search: keyword.trim() || undefined,
          subjectId: currentSubjectId || undefined,
          status: currentStatus === "ALL" ? undefined : currentStatus,
          sortBy: (currentSort?.key as ClassSortBy) ?? "createdAt",
          sortOrder: currentSort?.direction ?? "desc",
        });

        if (requestId !== requestIdRef.current) return;

        setClasses(response.classes);
        setResult(response);
        setCurrentPage(response.pagination.page);
        setError("");
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

  /*
   * ==================== FETCH SUBJECTS ====================
   */

  const fetchSubjects = useCallback(async () => {
    try {
      const response = await subjectApi.getSubjects({
        page: 1,
        limit: 100,
        sortBy: "title",
        sortOrder: "asc",
      });

      return response.subjects;
    } catch {
      return [];
    }
  }, []);

  /*
   * ==================== DEBOUNCED SEARCH ====================
   */

  const debouncedSearch = useDebouncedSearch(
    (
      keyword: string,
      currentSubjectId: string,
      currentStatus: StatusFilter,
      currentSort: DataTableSort | null,
    ) => {
      void fetchClasses(
        1,
        keyword,
        currentSubjectId,
        currentStatus,
        currentSort,
      );
    },
    400,
  );

  /*
   * ==================== INITIAL DATA ====================
   */

  useEffect(() => {
    let cancelled = false;

    const requestId = ++requestIdRef.current;

    const loadInitialData = async () => {
      setLoading(true);

      try {
        const [classResponse, subjectResponse] = await Promise.all([
          classApi.getClasses({
            page: 1,
            limit: PAGE_SIZE,
            sortBy: "createdAt",
            sortOrder: "desc",
          }),
          fetchSubjects(),
        ]);

        if (cancelled || requestId !== requestIdRef.current) return;

        setClasses(classResponse.classes);
        setResult(classResponse);
        setCurrentPage(classResponse.pagination.page);
        setSubjects(subjectResponse);
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

    void loadInitialData();

    return () => {
      cancelled = true;
      requestIdRef.current += 1;
      debouncedSearch.cancel();
    };
  }, [debouncedSearch, fetchSubjects]);

  /*
   * ==================== SEARCH ====================
   */

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);

    debouncedSearch(value, subjectId, status, sort);
  };

  /*
   * ==================== FILTER SUBJECT ====================
   */

  const handleSubjectChange = (value: string) => {
    debouncedSearch.cancel();

    setSubjectId(value);
    setCurrentPage(1);

    void fetchClasses(1, search, value, status, sort);
  };

  /*
   * ==================== FILTER STATUS ====================
   */

  const handleStatusChange = (value: StatusFilter) => {
    debouncedSearch.cancel();

    setStatus(value);
    setCurrentPage(1);

    void fetchClasses(1, search, subjectId, value, sort);
  };

  /*
   * ==================== SORT ====================
   */

  const handleSortChange = (nextSort: DataTableSort | null) => {
    debouncedSearch.cancel();

    setSort(nextSort);
    setCurrentPage(1);

    void fetchClasses(1, search, subjectId, status, nextSort);
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

      void fetchClasses(page, search, subjectId, status, sort);
    },
    [
      result?.pagination.totalPages,
      currentPage,
      debouncedSearch,
      fetchClasses,
      search,
      subjectId,
      status,
      sort,
    ],
  );

  /*
   * ==================== RETRY ====================
   */

  const handleRetry = () => {
    void fetchClasses(currentPage, search, subjectId, status, sort);
  };

  /*
   * ==================== ADD / EDIT CLASS ====================
   */

  const handleAddClass = () => {
    setEditingClass(null);
    setShowAddModal(true);
  };

  const handleEditClass = (classItem: ClassListItem) => {
    setEditingClass(classItem);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingClass(null);
  };

  const handleModalSuccess = () => {
    const nextPage = editingClass ? currentPage : 1;

    handleCloseModal();
    debouncedSearch.cancel();
    setCurrentPage(nextPage);

    void Promise.all([
      fetchClasses(nextPage, search, subjectId, status, sort),
      fetchSubjects().then(setSubjects),
    ]);
  };

  return (
    <main className={cx("wrapper")}>
      <Toolbar
        search={search}
        subjectId={subjectId}
        status={status}
        subjects={subjects}
        onSearchChange={handleSearchChange}
        onSubjectChange={handleSubjectChange}
        onStatusChange={handleStatusChange}
        onAddClass={handleAddClass}
      />

      <section className={cx("list-container")}>
        {loading && !result ? (
          <Loading />
        ) : (
          <ClassList
            classes={classes}
            loading={loading}
            sort={sort}
            onSortChange={handleSortChange}
            onEdit={handleEditClass}
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

      {showAddModal && (
        <AddModal
          classItem={editingClass}
          subjects={subjects}
          onClose={handleCloseModal}
          onSuccess={handleModalSuccess}
        />
      )}
    </main>
  );
}
