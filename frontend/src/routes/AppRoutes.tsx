import { Routes, Route } from "react-router-dom"

import LoginRoute from "@/routes/guards/LoginRoute"
import LoginPage from "@/pages/auth/LoginPage"
import TakeAttendance from "@/pages/monitor/TakeAttendance"
import RoleGuard from "./guards/RoleGuard"
import HomeRedirect from "./redirects/HomeRedirect"
import MonitorManagement from "@/pages/admin/MonitorManagement"

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/ingresar" element={<LoginRoute><LoginPage /></LoginRoute>} />
            <Route path="/monitores" element={<MonitorManagement />} />
            <Route path="/" element={<HomeRedirect />} />
            <Route element={<RoleGuard allowedRoles={["administrador", "monitor"]} />}>
                <Route path="/asistencia/:curso" element={<TakeAttendance />} />
            </Route>
        </Routes>
    )
}