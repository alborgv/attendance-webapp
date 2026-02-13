import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import AttendanceLists from "@/components/attendance/AttendanceLists";
import CreateCourseModal from '@/components/courses/modals/CreateCourseModal';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@/context/QueryContext';
import { CourseItem } from '@/types/props/attendance';
import { useToast } from '@/hooks/useToast';

export default function Attendance() {
    const { user } = useAuth();
    const { getCourses } = useQuery();
    const toast = useToast();

    const [courses, setCourses] = useState<CourseItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);

    const loadCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getCourses({ monitor_username: user?.username || "" });
            console.log("DATA:", data)
            setCourses(data ?? []);
        } catch (err) {
            console.error(err);
            setError('Error al cargar los cursos');

            toast.error("No se pudieron cargar los cursos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCourses();
    }, [user]);

    const handleCourseCreated = (newCourse: CourseItem) => {
        setCourses(prev => [newCourse, ...prev]);
        setIsCreateCourseModalOpen(false);

        toast.success(`El curso "${newCourse.modulo}" fue creado exitosamente`);
    };

    return (
        <Layout>
            <AttendanceLists
                courses={courses}
                loading={loading}
                error={error}
                onOpenCreateModal={() => setIsCreateCourseModalOpen(true)}
            />

            <CreateCourseModal
                isOpen={isCreateCourseModalOpen}
                onClose={() => setIsCreateCourseModalOpen(false)}
                onCourseCreated={handleCourseCreated}
            />
        </Layout>
    );
}
