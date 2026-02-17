import AttendanceMetrics from '@/components/Attendance/metrics/AttendanceMetrics';
import Layout from '@/components/Layout';
import AttendanceTable from '@/components/Attendance/tables/AttendanceTable';

export default function ViewAttendance() {
    return (
        <Layout>
            
                <div className="max-w-full mx-auto">
                    <AttendanceMetrics />
                    <AttendanceTable />
                </div>
        </Layout>
    );
}