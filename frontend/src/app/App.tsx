import { RouterProvider } from "react-router-dom";

import { AuthProvider } from "@/app/providers/Auth";
import { router } from "@/app/routes";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
