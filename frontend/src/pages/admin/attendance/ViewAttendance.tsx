import AttendanceMetrics from '@/components/Attendance/metrics/AttendanceMetrics';
import AdminLayout from '@/components/AdminLayout';
import AttendanceTable from '@/components/Attendance/tables/AttendanceTable';

export default function ViewAttendance() {
    return (
        <AdminLayout>
            <div className="max-w-full mx-auto">
                <AttendanceMetrics />
                <AttendanceTable />
            </div>
        </AdminLayout>
    );
}