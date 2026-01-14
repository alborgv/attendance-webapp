import { useNavigate } from 'react-router-dom';
import { IoAddCircle } from "react-icons/io5";
import { useState } from 'react';
import AttendanceListSkeleton from '../ui/Skeleton/AttendanceListSkeleton';
import CourseCard from '../ui/Card/CourseCard';
import EmptyAttendanceState from './EmptyAttendanceState';
import AttendanceErrorState from './AttendanceErrorState';
import { CourseItem } from '@/types/props/attendance';

interface Props {
    courses: CourseItem[];
    loading: boolean;
    error: string | null;
    onOpenCreateModal: () => void;
}

type ViewMode = 'active' | 'inactive';

export default function AttendanceLists({
    courses,
    loading,
    error,
    onOpenCreateModal
}: Props) {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<ViewMode>('active');

    const filteredCourses = courses.filter(course =>
        viewMode === 'active' ? course.estado === 'A' : course.estado === 'I'
    );

    const onContinue = (curso: CourseItem) => {
        navigate(`/asistencia/${curso.id}`);
    };

    if (loading) return <AttendanceListSkeleton />;
    if (error) return <AttendanceErrorState error={error} />;

    if (filteredCourses.length === 0) {
        return (
            <EmptyAttendanceState
                onOpenCreateModal={onOpenCreateModal}
                viewMode={viewMode}
                onToggleViewMode={() =>
                    setViewMode(viewMode === 'active' ? 'inactive' : 'active')
                }
            />
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="md:max-w-5xl max-w-full mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-xl font-bold">
                        {viewMode === 'active'
                            ? 'LISTA DE ASISTENCIAS ACTIVAS'
                            : 'LISTA DE ASISTENCIAS INACTIVAS'}
                    </h1>

                    <button
                        onClick={() =>
                            setViewMode(viewMode === 'active' ? 'inactive' : 'active')
                        }
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                    >
                        {viewMode === 'active' ? 'Ver Inactivos' : 'Ver Activos'}
                    </button>
                </div>

                {viewMode === 'active' && (
                    <button
                        onClick={onOpenCreateModal}
                        className="bg-white flex items-center p-4 rounded-lg shadow-sm border border-slate-100 cursor-pointer mb-6"
                    >
                        <IoAddCircle size={20} />
                        <span className="ml-2 text-sm font-medium">Crear curso</span>
                    </button>
                )}

                <div className="space-y-6">
                    {filteredCourses.map((course, index) => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            onContinue={onContinue}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
