import { useState, useEffect } from "react";
import { format } from "date-fns";
import StudentList from "@/components/Students/StudentList";
import Calendar from "@/components/ui/Calendar";
import AttendanceStats from "@/components/Attendance/AttendanceStats";
import Header from "@/components/Attendance/AttendanceHeader";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@/context/QueryContext";
import { AttendanceState } from "@/types/props/attendance";
import { Link, useNavigate, useParams } from "react-router-dom";
import AttendanceButton from "@/components/ui/Button/AttendanceButton";
import { IoArrowBack } from "react-icons/io5";
import TakeAttendanceSkeleton from "@/components/ui/Skeleton/TakeAttendanceSkeleton";
import { Student } from "@/types/props/students";
import ConfirmModal from "@/components/ui/Modal/ConfirmModal";

export default function TakeAttendance() {
    const { curso } = useParams<string>();
    const navigate = useNavigate();

    const { user } = useAuth();
    const { selectedCourse, setSelectedCourse, getAttendance, getCourseById, addStudentCourse, createAttendance, createStudentBasic } = useQuery();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const [attendanceByDate, setAttendanceByDate] = useState<Record<string, Record<string, AttendanceState>>>({});
    const [attendanceOriginalByDate, setAttendanceOriginalByDate] = useState<Record<string, Record<string, AttendanceState>>>({});

    const [isLoading, setIsLoading] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dateKey = format(selectedDate, "yyyy-MM-dd");
    const hasAttendance = Object.keys(attendanceOriginalByDate[dateKey] || {}).length > 0;

    const currentAttendance = attendanceByDate[dateKey] || {};
    const originalAttendance = attendanceOriginalByDate[dateKey] || {};

    type ConfirmType = "EXIT_EDIT" | "SUBMIT" | null;
    const [confirmType, setConfirmType] = useState<ConfirmType>(null);

    const totalStudents = selectedCourse?.estudiantes.length || 0;

    const markedCount = Object.values(currentAttendance)
        .filter(v => v !== "none").length;

    const isAttendanceComplete = markedCount === totalStudents;


    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const dateKey = format(selectedDate, "yyyy-MM-dd");
                const attendanceInfo = await getAttendance({ fecha: dateKey, curso });

                const attendanceMap = attendanceInfo.reduce((acc, student) => {
                    acc[student.estudiante.numero_identificacion] = student.estado || "none";
                    return acc;
                }, {} as Record<string, AttendanceState>);

                setAttendanceByDate(prev => ({
                    ...prev,
                    [dateKey]: attendanceMap
                }));

                setAttendanceOriginalByDate(prev => ({
                    ...prev,
                    [dateKey]: attendanceMap
                }));
                setIsLoading(false);

            } catch (error) {
                navigate('/');
                console.error("Error fetching attendance:", error);
            }
        };

        fetchAttendance();
    }, [selectedDate, curso, user]);


    useEffect(() => {
        if (!curso) {
            navigate('/');
            return;
        }

        const loadCourse = async () => {
            const course = await getCourseById(curso);
            setSelectedCourse(course);
        };

        loadCourse();
    }, [curso]);

    const setAttendance = (documentId: string, state: AttendanceState) => {
        setAttendanceByDate(prev => ({
            ...prev,
            [dateKey]: {
                ...(prev[dateKey] || {}),
                [documentId]: state
            }
        }));
    };

    const submitAttendance = async () => {
        if (!isAttendanceComplete) return;
        
        setConfirmType("SUBMIT");
    };


    const handleEdit = async () => {
        if (isEdit) {
            setConfirmType("EXIT_EDIT");
            return;
        }

        setIsEdit(!isEdit);
    };

    const handleAddStudent = async (student: Student) => {
        if (!curso) return;

        const resCourse = await addStudentCourse(curso, [student.id]);
        setSelectedCourse(resCourse);
    };

    const handleCreateStudent = async (primer_nombre: string, numero_identificacion: string, celular: string, tipo_identificacion?: string) => {
        const result = createStudentBasic(
            primer_nombre,
            numero_identificacion,
            celular,
            tipo_identificacion
        )

        return result
    }

    const getDateAttendanceStatus = (date: Date) => {
        const key = format(date, "yyyy-MM-dd");
        const dayAttendance = attendanceOriginalByDate[key];

        if (!dayAttendance) return "none";
        const values = Object.values(dayAttendance);
        if (values.every(v => v === "none")) return "none";
        if (values.some(v => v === "A")) return "has-absent";
        return "all-present";
    };

    const presentCount = Object.values(currentAttendance).filter(v => v === "P").length;
    const absentCount = Object.values(currentAttendance).filter(v => v === "A").length;
    const leaveCount = Object.values(currentAttendance).filter(v => v === "J").length;

    if (isLoading || !selectedCourse) {
        return <TakeAttendanceSkeleton />;
    }

    return (
        <Layout>
            <div className="min-h-screen p-4 md:p-6">

                <div className="max-w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <aside className="bg-white rounded-xl shadow-lg p-6">
                        <Link
                            to="/"
                            className="text-blue-600 hover:text-blue-800 font-medium flex items-center mb-2 transition-colors cursor-pointer text-sm sm:text-base"
                        >
                            <IoArrowBack size={14} className="mr-1 sm:mr-1 shrink-0" />
                            <span className="truncate">Volver al panel</span>
                        </Link>

                        <Calendar
                            currentMonth={currentMonth}
                            selectedDate={selectedDate}
                            onMonthChange={setCurrentMonth}
                            onDateSelect={setSelectedDate}
                            getDateAttendanceStatus={getDateAttendanceStatus}
                            isEdit={isEdit}
                        />

                        <AttendanceStats
                            totalStudents={selectedCourse?.estudiantes.length}
                            presentCount={presentCount}
                            absentCount={absentCount}
                            leaveCount={leaveCount}
                        />
                    </aside>

                    <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">

                        {selectedCourse ? (
                            <Header
                                selectedCourse={selectedCourse}
                                selectedDate={selectedDate}
                                onDateChange={setSelectedDate}
                                isEdit={isEdit}
                            />
                        ) : null}

                        {!hasAttendance ? (
                            <AttendanceButton
                                onSubmitAttendance={submitAttendance}
                                isSubmitting={isSubmitting}
                                onEditAttendance={handleEdit}
                                isEdit={isEdit}
                                course={selectedCourse}
                                onAddStudent={handleAddStudent}
                                onCreateStudent={handleCreateStudent}
                                canSubmit={isAttendanceComplete}
                            />
                        ) : null}

                        <StudentList
                            course={selectedCourse}
                            attendance={currentAttendance}
                            onAttendanceChange={setAttendance}
                            onEditAttendance={handleEdit}
                            isEdit={isEdit}
                        />
                    </div>

                </div>
            </div>

            <ConfirmModal
                open={confirmType !== null}
                title={
                    confirmType === "EXIT_EDIT"
                        ? "Salir sin guardar"
                        : "Confirmar envío"
                }
                message={
                    confirmType === "EXIT_EDIT"
                        ? "¿Deseas salir sin guardar la asistencia marcada?"
                        : "¿Deseas enviar la asistencia marcada?"
                }
                confirmText="Confirmar"
                cancelText="Cancelar"
                onCancel={() => {
                    setConfirmType(null);
                }}
                onConfirm={async () => {
                    if (confirmType === "EXIT_EDIT") {
                        setAttendanceByDate(prev => ({
                            ...prev,
                            [dateKey]: originalAttendance
                        }));
                        setIsEdit(false);
                    }

                    if (confirmType === "SUBMIT") {
                        if (!curso) return;

                        setIsSubmitting(true);

                        await createAttendance(curso, currentAttendance, dateKey);

                        setIsSubmitting(false);

                        setAttendanceOriginalByDate(prev => ({
                            ...prev,
                            [dateKey]: currentAttendance
                        }));

                        setIsEdit(false);
                    }

                    setConfirmType(null);
                }}
            />

        </Layout>
    );
}
