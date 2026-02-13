import { Routes, Route } from "react-router-dom"

import LoginRoute from "@/routes/guards/LoginRoute"
import LoginPage from "@/pages/auth/LoginPage"
import TakeAttendance from "@/pages/monitor/TakeAttendance"
import RoleGuard from "./guards/RoleGuard"
import HomeRedirect from "./redirects/HomeRedirect"
import MonitorManagement from "@/pages/admin/monitors/MonitorManagement"
import StudentRisk from "@/pages/admin/students/StudentRisk"
import AllStudentList from "@/pages/admin/students/AllStudentList"
import AllCourseList from "@/pages/admin/courses/AllCourseList"
import StudentAbsent from "@/pages/admin/students/StudentAbsent"

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/ingresar" element={<LoginRoute><LoginPage /></LoginRoute>} />
            <Route element={<RoleGuard allowedRoles={["administrador", "monitor"]} />}>
                <Route path="/asistencia/:curso" element={<TakeAttendance />} />
                <Route path="/" element={<HomeRedirect />} />
                <Route path="/monitores" element={<MonitorManagement />} />
                <Route path="/estudiantes_en_riesgo" element={<StudentRisk />} />
                <Route path="/estudiantes/ausentes" element={<StudentAbsent />} />
                <Route path="/estudiantes/lista" element={<AllStudentList />} />
                <Route path="/curso/lista" element={<AllCourseList />} />
            </Route>
        </Routes>
    )
}