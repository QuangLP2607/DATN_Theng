const PAGE_TITLES: Record<string, string> = {
  "/admin": "Tổng quan",
  "/admin/subjects": "Môn học",
  "/admin/classes": "Lớp học",
  "/admin/statistics": "Thống kê",
  "/admin/settings": "Cài đặt",

  "/student": "Tổng quan",
  "/student/classes": "Lớp học",
  "/student/lectures": "Bài giảng",
  "/student/assignments": "Bài tập",
  "/student/exams": "Kiểm tra",
  "/student/grades": "Điểm số",
  "/student/notifications": "Thông báo",

  "/teacher": "Tổng quan",
  "/teacher/classes": "Lớp học",
  "/teacher/content": "Nội dung",
  "/teacher/exams": "Kiểm tra",
  "/teacher/grading": "Chấm bài",
  "/teacher/students": "Học sinh",
  "/teacher/notifications": "Thông báo",
};

export function getPageTitle(pathname: string): string {
  const path = pathname.replace(/\/+$/, "") || "/";
  return PAGE_TITLES[path] ?? "EduLearning";
}
