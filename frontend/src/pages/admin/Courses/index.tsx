import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";

import Pagination from "@/components/Pagination";
import Loading from "@/components/Loading";
import ErrorState from "@/components/ErrorState";
import PageBreadcrumb from "@/components/PageBreadcrumb";

import courseApi, {
  type CourseListItem,
  type CourseSortBy,
} from "@/services/course";

import subjectApi from "@/services/subject";

import type { CourseStatus } from "@/interfaces/course";
import type { Subject } from "@/interfaces/subject";
import type { SortOrder } from "@/interfaces/common";

import useDebouncedSearch from "@/hooks/useDebouncedSearch";

import Toolbar, {
  type CourseSortOption,
  type CourseStatusFilter,
} from "./components/Toolbar";

import CardGrid from "./components/CardGrid";
import AddModal from "./components/AddModal";

import styles from "./Courses.module.scss";

const cx = classNames.bind(styles);

const PAGE_SIZE = 6;

const INITIAL_SORT: CourseSortOption = "newest";

const SORT_CONFIG: Record<
  CourseSortOption,
  {
    sortBy: CourseSortBy;
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
    sortBy: "title",
    order: "asc",
  },
  nameDesc: {
    sortBy: "title",
    order: "desc",
  },
};

interface CourseListResult {
  courses: CourseListItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function Courses() {
  const navigate = useNavigate();

  /*
   * ==================== STATE ====================
   */

  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [result, setResult] = useState<CourseListResult | null>(null);

  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [loading, setLoading] = useState(true);
  const [subjectLoading, setSubjectLoading] = useState(true);

  const [error, setError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseListItem | null>(
    null,
  );

  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<CourseSortOption>(INITIAL_SORT);

  const [subjectGradeId, setSubjectGradeId] = useState("");
  const [status, setStatus] = useState<CourseStatusFilter>("ALL");
  const [targetYear, setTargetYear] = useState("");

  const requestIdRef = useRef(0);

  /*
   * ==================== FETCH COURSES ====================
   */

  const fetchCourses = useCallback(
    async (
      page: number,
      keyword: string,
      sortOption: CourseSortOption,
      gradeId: string,
      statusFilter: CourseStatusFilter,
      year: string,
    ) => {
      const requestId = ++requestIdRef.current;

      setLoading(true);
      setError("");

      try {
        const { sortBy, order } = SORT_CONFIG[sortOption];

        const response = await courseApi.getCourses({
          page,
          limit: PAGE_SIZE,
          search: keyword.trim() || undefined,
          sortBy,
          order,
          subjectGradeId: gradeId || undefined,
          status:
            statusFilter === "ALL" ? undefined : (statusFilter as CourseStatus),
          targetYear: year ? Number(year) : undefined,
        });

        if (requestId !== requestIdRef.current) return;

        setCourses(response.courses);
        setResult(response);
        setCurrentPage(response.pagination.page);
      } catch {
        if (requestId === requestIdRef.current) {
          setError("Không thể tải danh sách khóa học.");
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
   * ==================== DEBOUNCED SEARCH ====================
   */

  const debouncedSearch = useDebouncedSearch(
    (
      keyword: string,
      sortOption: CourseSortOption,
      gradeId: string,
      statusFilter: CourseStatusFilter,
      year: string,
    ) => {
      void fetchCourses(1, keyword, sortOption, gradeId, statusFilter, year);
    },
    400,
  );

  /*
   * ==================== INITIAL DATA ====================
   */

  useEffect(() => {
    let cancelled = false;

    const requestId = ++requestIdRef.current;

    const loadCourses = async () => {
      try {
        const { sortBy, order } = SORT_CONFIG[INITIAL_SORT];

        const response = await courseApi.getCourses({
          page: 1,
          limit: PAGE_SIZE,
          sortBy,
          order,
        });

        if (cancelled || requestId !== requestIdRef.current) return;

        setCourses(response.courses);
        setResult(response);
        setCurrentPage(response.pagination.page);
        setError("");
      } catch {
        if (!cancelled && requestId === requestIdRef.current) {
          setError("Không thể tải danh sách khóa học.");
        }
      } finally {
        if (!cancelled && requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    };

    void loadCourses();

    return () => {
      cancelled = true;
      requestIdRef.current += 1;
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  /*
   * ==================== LOAD SUBJECTS ====================
   */

  useEffect(() => {
    let cancelled = false;

    const loadSubjects = async () => {
      try {
        const response = await subjectApi.getSubjects({
          page: 1,
          limit: 100,
          sortBy: "title",
          sortOrder: "asc",
        });

        if (!cancelled) {
          setSubjects(response.subjects);
        }
      } catch {
        if (!cancelled) {
          setSubjects([]);
        }
      } finally {
        if (!cancelled) {
          setSubjectLoading(false);
        }
      }
    };

    void loadSubjects();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * ==================== VIEW COURSE DETAIL ====================
   */

  const handleViewCourse = (course: CourseListItem) => {
    navigate(`/admin/courses/${course.id}`);
  };

  /*
   * ==================== SEARCH ====================
   */

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);

    debouncedSearch(value, sort, subjectGradeId, status, targetYear);
  };

  /*
   * ==================== SORT ====================
   */

  const handleSortChange = (value: CourseSortOption) => {
    debouncedSearch.cancel();

    setSort(value);
    setCurrentPage(1);

    void fetchCourses(1, search, value, subjectGradeId, status, targetYear);
  };

  /*
   * ==================== SUBJECT GRADE FILTER ====================
   */

  const handleSubjectGradeChange = (value: string) => {
    debouncedSearch.cancel();

    setSubjectGradeId(value);
    setCurrentPage(1);

    void fetchCourses(1, search, sort, value, status, targetYear);
  };

  /*
   * ==================== STATUS FILTER ====================
   */

  const handleStatusChange = (value: CourseStatusFilter) => {
    debouncedSearch.cancel();

    setStatus(value);
    setCurrentPage(1);

    void fetchCourses(1, search, sort, subjectGradeId, value, targetYear);
  };

  /*
   * ==================== TARGET YEAR FILTER ====================
   */

  const handleYearChange = (value: string) => {
    setTargetYear(value);
    setCurrentPage(1);

    debouncedSearch.cancel();

    if (value === "") {
      void fetchCourses(1, search, sort, subjectGradeId, status, "");
      return;
    }

    if (!/^\d{4}$/.test(value)) return;

    const year = Number(value);

    if (year < 1900 || year > 2100) return;

    void fetchCourses(1, search, sort, subjectGradeId, status, value);
  };

  /*
   * ==================== CLEAR FILTERS ====================
   */

  const handleClearFilters = () => {
    debouncedSearch.cancel();

    setSubjectGradeId("");
    setStatus("ALL");
    setTargetYear("");
    setCurrentPage(1);

    void fetchCourses(1, search, sort, "", "ALL", "");
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

      void fetchCourses(page, search, sort, subjectGradeId, status, targetYear);
    },
    [
      result?.pagination.totalPages,
      currentPage,
      debouncedSearch,
      fetchCourses,
      search,
      sort,
      subjectGradeId,
      status,
      targetYear,
    ],
  );

  /*
   * ==================== RETRY ====================
   */

  const handleRetry = () => {
    void fetchCourses(
      currentPage,
      search,
      sort,
      subjectGradeId,
      status,
      targetYear,
    );
  };

  /*
   * ==================== COURSE MODAL ====================
   */

  const handleOpenCreateModal = () => {
    setSelectedCourse(null);
    setShowAddModal(true);
  };

  const handleEditCourse = (course: CourseListItem) => {
    setSelectedCourse(course);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setSelectedCourse(null);
  };

  const handleCourseSuccess = () => {
    void fetchCourses(
      currentPage,
      search,
      sort,
      subjectGradeId,
      status,
      targetYear,
    );
  };

  /*
   * ==================== COURSE STATUS ====================
   */

  const handleTogglePublish = async (course: CourseListItem) => {
    try {
      if (course.status === "PUBLISHED") {
        await courseApi.unpublishCourse(course.id);
      } else {
        await courseApi.publishCourse(course.id);
      }

      void fetchCourses(
        currentPage,
        search,
        sort,
        subjectGradeId,
        status,
        targetYear,
      );
    } catch {
      setError(
        course.status === "PUBLISHED"
          ? "Không thể gỡ xuất bản khóa học."
          : "Không thể xuất bản khóa học.",
      );
    }
  };

  /*
   * ==================== RENDER ====================
   */

  return (
    <main className={cx("wrapper")}>
      <PageBreadcrumb items={[{ label: "Quản lý" }, { label: "Khóa học" }]} />

      <Toolbar
        search={search}
        sort={sort}
        subjectGradeId={subjectGradeId}
        status={status}
        targetYear={targetYear}
        subjects={subjects}
        subjectLoading={subjectLoading}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onSubjectGradeChange={handleSubjectGradeChange}
        onStatusChange={handleStatusChange}
        onTargetYearChange={handleYearChange}
        onClearFilters={handleClearFilters}
        onAddCourse={handleOpenCreateModal}
      />

      <section className={cx("list-container")}>
        {loading && !result ? (
          <Loading />
        ) : (
          <CardGrid
            courses={courses}
            onOpen={handleViewCourse}
            onEdit={handleEditCourse}
            onTogglePublish={handleTogglePublish}
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
          itemLabel="khóa học"
          ariaLabel="Phân trang khóa học"
          onPageChange={handlePageChange}
        />
      )}

      {showAddModal && (
        <AddModal
          key={selectedCourse?.id ?? "create"}
          course={selectedCourse}
          subjects={subjects}
          onClose={handleCloseModal}
          onSuccess={handleCourseSuccess}
        />
      )}
    </main>
  );
}
