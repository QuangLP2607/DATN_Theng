import { createBrowserRouter } from "react-router-dom";

import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";

import StudentHome from "@/pages/student/Home";
import TeacherHome from "@/pages/teacher/Home";
import AdminHome from "@/pages/admin/Home";

import MainLayout from "@/layouts/MainLayout";

import { ProtectedRoute, PublicRoute } from "./ProtectedRoute";

export const router = createBrowserRouter(
  [
    // Trang đăng nhập không sử dụng MainLayout
    {
      path: "/",
      element: <PublicRoute element={<Login />} />,
    },

    // Các trang chính sử dụng chung MainLayout
    {
      element: <MainLayout />,
      children: [
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
          path: "/teacher",
          element: (
            <ProtectedRoute
              allowedRoles={["TEACHER"]}
              element={<TeacherHome />}
            />
          ),
        },
        {
          path: "/admin",
          element: (
            <ProtectedRoute allowedRoles={["ADMIN"]} element={<AdminHome />} />
          ),
        },
      ],
    },

    // Trang không tồn tại
    {
      path: "*",
      element: <NotFound />,
    },
  ],
  {
    basename: "/eduLearning",
  },
);
