import AttendanceMetrics from '@/components/Attendance/AttendanceMetrics';
import Layout from '@/components/Layout';
import AttendanceTable from '@/components/ui/Table/AttendanceTable';

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