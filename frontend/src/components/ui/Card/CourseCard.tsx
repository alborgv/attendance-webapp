import { CourseCardProps } from '@/types/ui/cards';
import React from 'react';
import { FaUsers, FaCalendarAlt, FaUserTie, FaArrowRight, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import "dayjs/locale/es"


dayjs.extend(utc)
dayjs.locale("es")

const CourseCard: React.FC<CourseCardProps> = ({ course, onContinue, index }) => {
    const isActive = course.estado === "A";
    return (
        <div
            key={index}
            className="group bg-linear-to-br from-white to-gray-50 rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1"
        >
            <div className={`h-1.5 ${isActive ? 'bg-linear-to-r from-green-400 to-emerald-500' : 'bg-linear-to-r from-red-400 to-rose-500'}`} />

            <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <h3 className="flex-1 font-sans text-lg font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {course.modulo}
                    </h3>

                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${isActive
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}>
                        {isActive ? <FaCheckCircle className="text-xs" /> : <FaTimesCircle className="text-xs" />}
                        <span className="hidden sm:inline">{isActive ? "Activo" : "Inactivo"}</span>
                    </div>
                </div>

                <div className="space-y-2.5 mb-5">
                    <div className="flex items-center text-gray-600 text-sm">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 mr-3">
                            <FaCalendarAlt className="text-blue-600 text-xs" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-medium">Fecha de creación</p>
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                {/* {new Date(course.fecha).toLocaleDateString("es-CO", {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })} */}
                                {dayjs.utc(course.fecha).format("DD [de] MMMM [de] YYYY")}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center text-gray-600 text-sm">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-50 mr-3">
                            <FaUserTie className="text-purple-600 text-xs" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-medium">Monitor asignado</p>
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                {typeof course.monitor !== "string" ? course.monitor.nombre_completo : null}

                            </p>
                        </div>
                    </div>

                    <div className="flex items-center text-gray-600 text-sm">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-50 mr-3">
                            <FaUsers className="text-amber-600 text-xs" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-medium">Estudiantes inscritos</p>
                            <p className="text-sm font-semibold text-gray-900">
                                {course.estudiantes?.length} {course.estudiantes?.length === 1 ? 'estudiante' : 'estudiantes'}
                            </p>
                        </div>
                    </div>
                </div>

                {isActive ? (
                    <button
                        onClick={() => onContinue(course)}
                        className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <span>Continuar con el curso</span>
                        <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                    </button>
                ) : (
                    <div className="w-full bg-gray-100 text-gray-500 py-3 px-4 rounded-xl text-sm sm:text-base font-semibold text-center">
                        Curso inactivo
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseCard;