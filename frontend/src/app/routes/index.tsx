import { createBrowserRouter } from "react-router-dom";

import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";

import StudentHome from "@/pages/student/Home";
import StudentClasses from "@/pages/student/Classes";
import StudentExams from "@/pages/student/Exams";
import StudentGrades from "@/pages/student/Grades";
import StudentAssignments from "@/pages/student/Assignments";
import StudentLectures from "@/pages/student/Lectures";
import StudentNotifications from "@/pages/student/Notifications";

import TeacherHome from "@/pages/teacher/Home";
import AdminHome from "@/pages/admin/Home";

import MainLayout from "@/layouts/MainLayout";

import { ProtectedRoute, PublicRoute } from "./ProtectedRoute";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <PublicRoute element={<Login />} />,
    },
    {
      element: <MainLayout />,
      children: [
        // STUDENT
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

        // TEACHER
        {
          path: "/teacher",
          element: (
            <ProtectedRoute
              allowedRoles={["TEACHER"]}
              element={<TeacherHome />}
            />
          ),
        },

        // ADMIN
        {
          path: "/admin",
          element: (
            <ProtectedRoute allowedRoles={["ADMIN"]} element={<AdminHome />} />
          ),
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ],
  {
    basename: "/eduLearning",
  },
);
