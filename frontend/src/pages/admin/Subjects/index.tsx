import { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";

import Pagination from "@/components/Pagination";
import Loading from "@/components/Loading";
import ErrorState from "@/components/ErrorState";

import subjectApi, {
  type SubjectListItem,
  type GetSubjectsResponse,
} from "@/services/subject";

import useDebouncedSearch from "@/hooks/useDebouncedSearch";

import Toolbar from "./components/Toolbar";
import CardGrid from "./components/CardGrid";
import AddModal from "./components/AddModal";

import styles from "./Subjects.module.scss";

const cx = classNames.bind(styles);

const PAGE_SIZE = 6;

export default function Subjects() {
  const [subjects, setSubjects] = useState<SubjectListItem[]>([]);
  const [result, setResult] = useState<GetSubjectsResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSubject, setSelectedSubject] =
    useState<SubjectListItem | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const requestIdRef = useRef(0);

  /*
   * ==================== FETCH SUBJECTS ====================
   */

  const fetchSubjects = useCallback(async (page: number, keyword: string) => {
    const requestId = ++requestIdRef.current;

    setLoading(true);

    try {
      const response = await subjectApi.getSubjects({
        page,
        limit: PAGE_SIZE,
        search: keyword.trim() || undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      if (requestId !== requestIdRef.current) return;

      setSubjects(response.subjects);
      setResult(response);
      setCurrentPage(response.pagination.page);
      setError("");
    } catch {
      if (requestId === requestIdRef.current) {
        setError("Không thể tải danh sách môn học.");
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  /*
   * ==================== DEBOUNCED SEARCH ====================
   */

  const debouncedSearch = useDebouncedSearch((keyword: string) => {
    void fetchSubjects(1, keyword);
  }, 400);

  /*
   * ==================== INITIAL DATA ====================
   */

  useEffect(() => {
    let cancelled = false;

    const requestId = ++requestIdRef.current;

    const loadSubjects = async () => {
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
        setError("");
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

    void loadSubjects();

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

      void fetchSubjects(page, search);
    },
    [
      result?.pagination.totalPages,
      currentPage,
      debouncedSearch,
      fetchSubjects,
      search,
    ],
  );

  /*
   * ==================== RETRY ====================
   */

  const handleRetry = () => {
    void fetchSubjects(currentPage, search);
  };

  /*
   * ==================== SUBJECT MODAL ====================
   */

  const handleOpenCreateModal = () => {
    setSelectedSubject(null);
    setShowAddModal(true);
  };

  const handleEditSubject = (subject: SubjectListItem) => {
    setSelectedSubject(subject);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setSelectedSubject(null);
  };

  const handleSubjectSuccess = () => {
    void fetchSubjects(currentPage, search);
  };

  /*
   * ==================== RENDER ====================
   */

  return (
    <main className={cx("wrapper")}>
      <Toolbar
        search={search}
        onSearchChange={handleSearchChange}
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
