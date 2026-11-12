import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";

import Pagination from "@/components/Pagination";
import Loading from "@/components/Loading";
import ErrorState from "@/components/ErrorState";
import PageBreadcrumb from "@/components/PageBreadcrumb";

import subjectApi, {
  type GetSubjectsResponse,
  type SubjectSortBy,
} from "@/services/subject";

import type { Subject } from "@/interfaces/subject";
import type { SortOrder } from "@/interfaces/common";

import useDebouncedSearch from "@/hooks/useDebouncedSearch";

import Toolbar, { type SubjectSortOption } from "./components/Toolbar";
import CardGrid from "./components/CardGrid";
import AddModal from "./components/AddModal";

import styles from "./Subjects.module.scss";

const cx = classNames.bind(styles);

const PAGE_SIZE = 6;

const INITIAL_SORT: SubjectSortOption = "newest";

function getSortParams(sort: SubjectSortOption): {
  sortBy: SubjectSortBy;
  sortOrder: SortOrder;
} {
  switch (sort) {
    case "oldest":
      return {
        sortBy: "createdAt",
        sortOrder: "asc",
      };

    case "nameAsc":
      return {
        sortBy: "title",
        sortOrder: "asc",
      };

    case "nameDesc":
      return {
        sortBy: "title",
        sortOrder: "desc",
      };

    case "newest":
    default:
      return {
        sortBy: "createdAt",
        sortOrder: "desc",
      };
  }
}

export default function Subjects() {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [result, setResult] = useState<GetSubjectsResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SubjectSortOption>(INITIAL_SORT);

  const requestIdRef = useRef(0);

  /*
   * ==================== FETCH SUBJECTS ====================
   */

  const fetchSubjects = useCallback(
    async (page: number, keyword: string, sortOption: SubjectSortOption) => {
      const requestId = ++requestIdRef.current;

      setLoading(true);
      setError("");

      try {
        const { sortBy, sortOrder } = getSortParams(sortOption);

        const response = await subjectApi.getSubjects({
          page,
          limit: PAGE_SIZE,
          search: keyword.trim() || undefined,
          sortBy,
          sortOrder,
        });

        if (requestId !== requestIdRef.current) return;

        setSubjects(response.subjects);
        setResult(response);
        setCurrentPage(response.pagination.page);
      } catch {
        if (requestId === requestIdRef.current) {
          setError("Không thể tải danh sách môn học.");
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

  const debouncedSearch = useDebouncedSearch((keyword: string) => {
    void fetchSubjects(1, keyword, sort);
  }, 400);

  /*
   * ==================== INITIAL DATA ====================
   */

  useEffect(() => {
    let cancelled = false;
    const requestId = ++requestIdRef.current;

    const loadInitialSubjects = async () => {
      try {
        const response = await subjectApi.getSubjects({
          page: 1,
          limit: PAGE_SIZE,
          sortBy: "createdAt",
          sortOrder: "desc",
        });

        if (cancelled || requestId !== requestIdRef.current) return;

        setSubjects(response.subjects);
        setResult(response);
        setCurrentPage(response.pagination.page);
      } catch {
        if (!cancelled && requestId === requestIdRef.current) {
          setError("Không thể tải danh sách môn học.");
        }
      } finally {
        if (!cancelled && requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    };

    void loadInitialSubjects();

    return () => {
      cancelled = true;
      requestIdRef.current += 1;
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  /*
   * ==================== SEARCH ====================
   */

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);

    debouncedSearch(value);
  };

  /*
   * ==================== SORT ====================
   */

  const handleSortChange = (value: SubjectSortOption) => {
    debouncedSearch.cancel();

    setSort(value);
    setCurrentPage(1);

    void fetchSubjects(1, search, value);
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

      void fetchSubjects(page, search, sort);
    },
    [
      result?.pagination.totalPages,
      currentPage,
      debouncedSearch,
      fetchSubjects,
      search,
      sort,
    ],
  );

  /*
   * ==================== RETRY ====================
   */

  const handleRetry = () => {
    void fetchSubjects(currentPage, search, sort);
  };

  /*
   * ==================== SUBJECT MODAL ====================
   */

  const handleOpenCreateModal = () => {
    setSelectedSubject(null);
    setShowAddModal(true);
  };

  const handleEditSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setSelectedSubject(null);
  };

  const handleSubjectSuccess = () => {
    void fetchSubjects(currentPage, search, sort);
  };

  /*
   * ==================== SUBJECT GRADE NAVIGATION ====================
   */

  const handleSelectGrade = (subjectGradeId: string) => {
    navigate(`/admin/subject-grades/${subjectGradeId}`);
  };

  /*
   * ==================== RENDER ====================
   */

  return (
    <main className={cx("wrapper")}>
      <PageBreadcrumb
        items={[
          {
            label: "Quản lý",
          },
          {
            label: "Môn học",
          },
        ]}
      />

      <Toolbar
        search={search}
        sort={sort}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onAddSubject={handleOpenCreateModal}
      />

      <section className={cx("list-container")}>
        {loading && !result ? (
          <Loading />
        ) : (
          <CardGrid
            subjects={subjects}
            loading={loading}
            onEdit={handleEditSubject}
            onSelectGrade={handleSelectGrade}
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
          itemLabel="môn học"
          ariaLabel="Phân trang môn học"
          onPageChange={handlePageChange}
        />
      )}

      {showAddModal && (
        <AddModal
          key={selectedSubject?.id ?? "create"}
          subject={selectedSubject}
          onClose={handleCloseModal}
          onSuccess={handleSubjectSuccess}
        />
      )}
    </main>
  );
}
