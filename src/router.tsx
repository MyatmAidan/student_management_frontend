import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Providers } from "@/components/Providers";
import { AppLayout } from "@/components/AppLayout";
import DashboardPage from "@/src/pages/DashboardPage";
import ClassListPage from "@/src/pages/classes/ClassListPage";
import ClassCreatePage from "@/src/pages/classes/ClassCreatePage";
import ClassDetailPage from "@/src/pages/classes/ClassDetailPage";
import ClassEditPage from "@/src/pages/classes/ClassEditPage";
import StudentListPage from "@/src/pages/students/StudentListPage";
import StudentCreatePage from "@/src/pages/students/StudentCreatePage";
import StudentDetailPage from "@/src/pages/students/StudentDetailPage";
import StudentEditPage from "@/src/pages/students/StudentEditPage";

export function AppRouter() {
  return (
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/classes" element={<ClassListPage />} />
            <Route path="/classes/create" element={<ClassCreatePage />} />
            <Route path="/classes/:id" element={<ClassDetailPage />} />
            <Route path="/classes/:id/edit" element={<ClassEditPage />} />
            <Route path="/students" element={<StudentListPage />} />
            <Route path="/students/create" element={<StudentCreatePage />} />
            <Route path="/students/:id" element={<StudentDetailPage />} />
            <Route path="/students/:id/edit" element={<StudentEditPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Providers>
  );
}
