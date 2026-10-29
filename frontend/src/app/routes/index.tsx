import { createBrowserRouter } from "react-router-dom";

import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import ActivateAccount from "@/pages/ActivateAccount";

import StudentHome from "@/pages/student/Home";
import StudentClasses from "@/pages/student/Classes";
import StudentExams from "@/pages/student/Exams";
import StudentGrades from "@/pages/student/Grades";
import StudentAssignments from "@/pages/student/Assignments";
import StudentLectures from "@/pages/student/Lectures";
import StudentNotifications from "@/pages/student/Notifications";

import TeacherHome from "@/pages/teacher/Home";
import TeacherClasses from "@/pages/teacher/Classes";
import TeacherContent from "@/pages/teacher/Content";
import TeacherExams from "@/pages/teacher/Exams";
import TeacherGrading from "@/pages/teacher/Grading";
import TeacherStudents from "@/pages/teacher/Students";
import TeacherNotifications from "@/pages/teacher/Notifications";

import AdminHome from "@/pages/admin/Home";
import AdminClasses from "@/pages/admin/Classes";
import AdminUsers from "@/pages/admin/Users";
import AdminStatistics from "@/pages/admin/Statistics";
import AdminSubjects from "@/pages/admin/Subjects";
import AdminSettings from "@/pages/admin/Settings";

import MainLayout from "@/layouts/MainLayout";

import { ProtectedRoute, PublicRoute } from "./ProtectedRoute";

export const router = createBrowserRouter(
  [
    // PUBLIC
    {
      path: "/",
      element: <PublicRoute element={<Login />} />,
    },
    {
      path: "/activate-account",
      element: <ActivateAccount />,
    },

    // AUTHENTICATED
    {
      element: <MainLayout />,
      children: [
        // ==================== STUDENT ====================
        {
          path: "/student",
          element: (
            <ProtectedRoute
              allowedRoles={["STUDENT"]}
              element={<StudentHome />}
            />
          ),
        },
        {
          path: "/student/classes",
          element: (
            <ProtectedRoute
              allowedRoles={["STUDENT"]}
              element={<StudentClasses />}
            />
          ),
        },
        {
          path: "/student/exams",
          element: (
            <ProtectedRoute
              allowedRoles={["STUDENT"]}
              element={<StudentExams />}
            />
          ),
        },
        {
          path: "/student/grades",
          element: (
            <ProtectedRoute
              allowedRoles={["STUDENT"]}
              element={<StudentGrades />}
            />
          ),
        },
        {
          path: "/student/assignments",
          element: (
            <ProtectedRoute
              allowedRoles={["STUDENT"]}
              element={<StudentAssignments />}
            />
          ),
        },
        {
          path: "/student/lectures",
          element: (
            <ProtectedRoute
              allowedRoles={["STUDENT"]}
              element={<StudentLectures />}
            />
          ),
        },
        {
          path: "/student/notifications",
          element: (
            <ProtectedRoute
              allowedRoles={["STUDENT"]}
              element={<StudentNotifications />}
            />
          ),
        },

        // ==================== TEACHER ====================
        {
          path: "/teacher",
          element: (
            <ProtectedRoute
              allowedRoles={["TEACHER"]}
              element={<TeacherHome />}
            />
          ),
        },
        {
          path: "/teacher/classes",
          element: (
            <ProtectedRoute
              allowedRoles={["TEACHER"]}
              element={<TeacherClasses />}
            />
          ),
        },
        {
          path: "/teacher/content",
          element: (
            <ProtectedRoute
              allowedRoles={["TEACHER"]}
              element={<TeacherContent />}
            />
          ),
        },
        {
          path: "/teacher/exams",
          element: (
            <ProtectedRoute
              allowedRoles={["TEACHER"]}
              element={<TeacherExams />}
            />
          ),
        },
        {
          path: "/teacher/grading",
          element: (
            <ProtectedRoute
              allowedRoles={["TEACHER"]}
              element={<TeacherGrading />}
            />
          ),
        },
        {
          path: "/teacher/students",
          element: (
            <ProtectedRoute
              allowedRoles={["TEACHER"]}
              element={<TeacherStudents />}
            />
          ),
        },
        {
          path: "/teacher/notifications",
          element: (
            <ProtectedRoute
              allowedRoles={["TEACHER"]}
              element={<TeacherNotifications />}
            />
          ),
        },

        // ==================== ADMIN ====================
        {
          path: "/admin",
          element: (
            <ProtectedRoute allowedRoles={["ADMIN"]} element={<AdminHome />} />
          ),
        },
        {
          path: "/admin/users",
          element: (
            <ProtectedRoute allowedRoles={["ADMIN"]} element={<AdminUsers />} />
          ),
        },
        {
          path: "/admin/subjects",
          element: (
            <ProtectedRoute
              allowedRoles={["ADMIN"]}
              element={<AdminSubjects />}
            />
          ),
        },
        {
          path: "/admin/classes",
          element: (
            <ProtectedRoute
              allowedRoles={["ADMIN"]}
              element={<AdminClasses />}
            />
          ),
        },
        {
          path: "/admin/statistics",
          element: (
            <ProtectedRoute
              allowedRoles={["ADMIN"]}
              element={<AdminStatistics />}
            />
          ),
        },
        {
          path: "/admin/settings",
          element: (
            <ProtectedRoute
              allowedRoles={["ADMIN"]}
              element={<AdminSettings />}
            />
          ),
        },
      ],
    },

    // NOT FOUND
    {
      path: "*",
      element: <NotFound />,
    },
  ],
  {
    basename: "/eduLearning",
  },
);
