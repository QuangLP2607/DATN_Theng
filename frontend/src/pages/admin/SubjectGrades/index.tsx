import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import Loading from "@/components/Loading";
import ErrorState from "@/components/ErrorState";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import Pagination from "@/components/Pagination";

import subjectGradeApi from "@/services/subjectGrade";
import courseApi, {
  type CourseListItem,
  type CourseSortBy,
} from "@/services/course";

import type { SubjectGradeDetail } from "@/interfaces/subjectGrade";
import type { CourseStatus } from "@/interfaces/course";
import type { SortOrder } from "@/interfaces/common";

import useDebouncedSearch from "@/hooks/useDebouncedSearch";

import Header from "./components/Header";
import Toolbar, { type CourseStatusFilter } from "./components/Toolbar";
import CardGrid from "./components/CardGrid";
import AddModal from "./components/AddModal";

import styles from "./SubjectGrades.module.scss";

const cx = classNames.bind(styles);

const PAGE_SIZE = 6;

interface CourseListResult {
  courses: CourseListItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const SORT_CONFIG: {
  sortBy: CourseSortBy;
  order: SortOrder;
} = {
  sortBy: "createdAt",
  order: "desc",
};

const GRADE_LABELS = {
  GRADE_10: "Khối 10",
  GRADE_11: "Khối 11",
  GRADE_12: "Khối 12",
} as const;

export default function SubjectGrades() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  /*
   * ==================== STATE ====================
   */

  const [subjectGrade, setSubjectGrade] = useState<SubjectGradeDetail | null>(
    null,
  );

  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [result, setResult] = useState<CourseListResult | null>(null);

  const [loading, setLoading] = useState(true);
  const [courseLoading, setCourseLoading] = useState(true);

  const [error, setError] = useState("");
  const [courseError, setCourseError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CourseStatusFilter>("ALL");

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseListItem | null>(
    null,
  );

  /*
   * ==================== REQUEST REFS ====================
   */

  const subjectGradeRequestIdRef = useRef(0);
  const courseRequestIdRef = useRef(0);

  /*
   * ==================== FETCH COURSES ====================
   */

  const fetchCourses = useCallback(
    async (page: number, keyword: string, statusFilter: CourseStatusFilter) => {
      if (!id) return;

      const requestId = ++courseRequestIdRef.current;

      setCourseLoading(true);
      setCourseError("");

      try {
        const response = await courseApi.getCourses({
          page,
          limit: PAGE_SIZE,
          subjectGradeId: id,
          search: keyword.trim() || undefined,
          status:
            statusFilter === "ALL" ? undefined : (statusFilter as CourseStatus),
          sortBy: SORT_CONFIG.sortBy,
          order: SORT_CONFIG.order,
        });

        if (requestId !== courseRequestIdRef.current) return;

        setCourses(response.courses);
        setResult(response);
        setCurrentPage(response.pagination.page);
      } catch {
        if (requestId === courseRequestIdRef.current) {
          setCourseError("Không thể tải danh sách khóa học.");
        }
      } finally {
        if (requestId === courseRequestIdRef.current) {
          setCourseLoading(false);
        }
      }
    },
    [id],
  );

  /*
   * ==================== SEARCH ====================
   */

  const debouncedSearch = useDebouncedSearch(
    (keyword: string, statusFilter: CourseStatusFilter) => {
      void fetchCourses(1, keyword, statusFilter);
    },
    400,
  );

  /*
   * ==================== INITIAL DATA ====================
   */

  useEffect(() => {
    let cancelled = false;

    const subjectRequestId = ++subjectGradeRequestIdRef.current;
    const courseRequestId = ++courseRequestIdRef.current;

    const loadInitialData = async () => {
      if (!id) return;

      const [subjectResult, courseResult] = await Promise.allSettled([
        subjectGradeApi.getSubjectGradeById(id),
        courseApi.getCourses({
          page: 1,
          limit: PAGE_SIZE,
          subjectGradeId: id,
          sortBy: SORT_CONFIG.sortBy,
          order: SORT_CONFIG.order,
        }),
      ]);

      if (cancelled) return;

      if (subjectRequestId === subjectGradeRequestIdRef.current) {
        if (subjectResult.status === "fulfilled") {
          setSubjectGrade(subjectResult.value);
          setError("");
        } else {
          setSubjectGrade(null);
          setError("Không thể tải thông tin môn học và khối lớp.");
        }

        setLoading(false);
      }

      if (courseRequestId === courseRequestIdRef.current) {
        if (courseResult.status === "fulfilled") {
          setCourses(courseResult.value.courses);
          setResult(courseResult.value);
          setCurrentPage(courseResult.value.pagination.page);
          setCourseError("");
        } else {
          setCourseError("Không thể tải danh sách khóa học.");
        }

        setCourseLoading(false);
      }
    };

    void loadInitialData();

    return () => {
      cancelled = true;

      subjectGradeRequestIdRef.current += 1;
      courseRequestIdRef.current += 1;

      debouncedSearch.cancel();
    };
  }, [id, debouncedSearch]);

  /*
   * ==================== SEARCH HANDLER ====================
   */

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
      setCurrentPage(1);

      debouncedSearch(value, status);
    },
    [debouncedSearch, status],
  );

  /*
   * ==================== STATUS FILTER ====================
   */

  const handleStatusChange = useCallback(
    (value: CourseStatusFilter) => {
      debouncedSearch.cancel();

      setStatus(value);
      setCurrentPage(1);

      void fetchCourses(1, search, value);
    },
    [debouncedSearch, fetchCourses, search],
  );

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

      void fetchCourses(page, search, status);
    },
    [
      result?.pagination.totalPages,
      currentPage,
      debouncedSearch,
      fetchCourses,
      search,
      status,
    ],
  );

  /*
   * ==================== RETRY ====================
   */

  const handleRetrySubjectGrade = useCallback(async () => {
    if (!id) return;

    const requestId = ++subjectGradeRequestIdRef.current;

    setLoading(true);
    setError("");

    try {
      const response = await subjectGradeApi.getSubjectGradeById(id);

      if (requestId !== subjectGradeRequestIdRef.current) return;

      setSubjectGrade(response);
    } catch {
      if (requestId === subjectGradeRequestIdRef.current) {
        setSubjectGrade(null);
        setError("Không thể tải thông tin môn học và khối lớp.");
      }
    } finally {
      if (requestId === subjectGradeRequestIdRef.current) {
        setLoading(false);
      }
    }
  }, [id]);

  const handleRetryCourses = useCallback(() => {
    void fetchCourses(currentPage, search, status);
  }, [fetchCourses, currentPage, search, status]);

  /*
   * ==================== COURSE MODAL ====================
   */

  const handleOpenAddModal = useCallback(() => {
    setSelectedCourse(null);
    setShowAddModal(true);
  }, []);

  const handleEditCourse = useCallback((course: CourseListItem) => {
    setSelectedCourse(course);
    setShowAddModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowAddModal(false);
    setSelectedCourse(null);
  }, []);

  const handleCourseSuccess = useCallback(() => {
    debouncedSearch.cancel();

    // Khóa học mới được sắp xếp ở đầu danh sách.
    const page = selectedCourse ? currentPage : 1;

    setCurrentPage(page);
    void fetchCourses(page, search, status);
  }, [
    debouncedSearch,
    selectedCourse,
    currentPage,
    fetchCourses,
    search,
    status,
  ]);

  /*
   * ==================== COURSE STATUS ====================
   */

  const handleTogglePublish = useCallback(
    async (course: CourseListItem) => {
      if (course.status === "ARCHIVED") return;

      debouncedSearch.cancel();
      setCourseError("");

      try {
        if (course.status === "PUBLISHED") {
          await courseApi.unpublishCourse(course.id);
        } else {
          await courseApi.publishCourse(course.id);
        }

        await fetchCourses(currentPage, search, status);
      } catch {
        setCourseError(
          course.status === "PUBLISHED"
            ? "Không thể gỡ xuất bản khóa học."
            : "Không thể xuất bản khóa học.",
        );
      }
    },
    [debouncedSearch, fetchCourses, currentPage, search, status],
  );

  /*
   * ==================== INVALID ROUTE ====================
   */

  if (!id) {
    return (
      <main className={cx("wrapper")}>
        <PageBreadcrumb
          items={[
            { label: "Quản lý" },
            { label: "Môn học", to: "/admin/subjects" },
          ]}
        />

        <ErrorState
          message="Không tìm thấy thông tin khối lớp."
          onRetry={() => navigate("/admin/subjects")}
        />
      </main>
    );
  }

  /*
   * ==================== LOADING / ERROR ====================
   */

  if (loading) {
    return (
      <main className={cx("wrapper")}>
        <PageBreadcrumb
          items={[
            { label: "Quản lý" },
            { label: "Môn học", to: "/admin/subjects" },
          ]}
        />

        <div className={cx("page-state")}>
          <Loading />
        </div>
      </main>
    );
  }

  if (error || !subjectGrade) {
    return (
      <main className={cx("wrapper")}>
        <PageBreadcrumb
          items={[
            { label: "Quản lý" },
            { label: "Môn học", to: "/admin/subjects" },
          ]}
        />

        <ErrorState
          message={error || "Không tìm thấy thông tin khối lớp."}
          onRetry={handleRetrySubjectGrade}
          loading={loading}
        />
      </main>
    );
  }

  /*
   * ==================== DATA ====================
   */

  const { subject, grade } = subjectGrade;
  const gradeLabel = GRADE_LABELS[grade];

  /*
   * ==================== RENDER ====================
   */

  return (
    <main className={cx("wrapper")}>
      <PageBreadcrumb
        items={[
          { label: "Quản lý" },
          { label: "Môn học", to: "/admin/subjects" },
          { label: subject.title },
          { label: gradeLabel },
        ]}
      />

      <Header
        subjectCode={subject.code}
        subjectTitle={subject.title}
        subjectIcon={subject.icon}
        gradeLabel={gradeLabel}
        onBack={() => navigate("/admin/subjects")}
      />

      <section className={cx("course-section")}>
        <div className={cx("section-heading")}>
          <div>
            <h2>Danh sách khóa học</h2>
            <p>
              {result?.pagination.total ?? 0} khóa học thuộc{" "}
              {gradeLabel.toLowerCase()}.
            </p>
          </div>
        </div>

        <Toolbar
          search={search}
          status={status}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onAddCourse={handleOpenAddModal}
        />

        <div className={cx("list-container")}>
          {courseError && (
            <div className={cx("inline-error")}>
              <Icon icon="lucide:alert-circle" />
              <span>{courseError}</span>

              <button
                type="button"
                onClick={handleRetryCourses}
                disabled={courseLoading}
              >
                Thử lại
              </button>
            </div>
          )}

          <CardGrid
            courses={courses}
            loading={courseLoading}
            onEdit={handleEditCourse}
            onTogglePublish={handleTogglePublish}
            onOpen={(course) => navigate(`/admin/courses/${course.id}`)}
          />
        </div>

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
      </section>

      {showAddModal && (
        <AddModal
          key={selectedCourse?.id ?? "create"}
          course={selectedCourse}
          subjectGradeId={id}
          onClose={handleCloseModal}
          onSuccess={handleCourseSuccess}
        />
      )}
    </main>
  );
}
