import Layout from '@/components/Layout';
import CourseListTable from '@/components/courses/tables/CourseListTable';
import { CourseFilters } from '@/components/filters';
import ExportExcelButton from '@/components/ui/Button/ExportExcelButton';
import { VolverPanel } from '@/components/ui/VolverPanel';
import { ExcelColumn } from '@/context';
import { useQuery } from '@/context/QueryContext';
import { CourseItem } from '@/types/props/attendance';
import { useEffect, useState } from 'react';

export default function AllCourseList() {

    const { getAllCourse, exportExcel } = useQuery();

    const [data, setData] = useState<CourseItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingExcel, setLoadingExcel] = useState(false);

    const [filters, setFilters] = useState<CourseFilters>({
        status: 'A'
    });

    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(8);

    const fetchCourse = async () => {
        setLoading(true);
        try {
            const response = await getAllCourse({
                ...filters,
                page,
                pageSize,
            });
            
            setData(response.results);
            setCount(response.count);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourse();
    }, [filters, page]);

    const handleFilter = (newFilters: CourseFilters) => {
        setPage(1);
        setFilters(newFilters);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleExport = async () => {
        setLoadingExcel(true);

        const columns: ExcelColumn<CourseItem>[] = [
            { key: 'modulo', label: 'Módulo' },
            { key: 'monitor', label: 'Monitor' },
            { key: 'total_estudiantes', label: 'Total estudiantes' },
            { key: 'estado', label: 'Estado' },
            { key: 'fecha', label: 'Fecha inicio' },
        ];

        const title = "LISTA DE CURSOS";
        const filename = "lista_cursos";

        await exportExcel(filename, columns, title, data);

        setLoadingExcel(false);
    };

    return (
        <Layout>
            <div className="mb-8 p-4 md:p-6">
                <VolverPanel />

                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className='px-4'>
                        <h2 className="text-xl md:text-2xl font-sans font-bold text-gray-800">
                            LISTA DE CURSOS
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <ExportExcelButton
                            refresh={loading || loadingExcel}
                            onClick={handleExport}
                        />
                    </div>
                </div>

                <CourseListTable
                    data={data}
                    loading={loading}
                    onRefresh={fetchCourse}
                    filters={filters}
                    onFilter={handleFilter}
                    count={count}
                    currentPage={page}
                    onPageChange={handlePageChange}
                />
            </div>
        </Layout>
    );
}
