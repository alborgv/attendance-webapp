import AttendanceMetrics from '@/components/attendance/metrics/AttendanceMetrics';
import Layout from '@/components/Layout';
import AttendanceTable from '@/components/attendance/tables/AttendanceTable';

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