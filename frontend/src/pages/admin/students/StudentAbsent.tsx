import { StudentAbsentFilter } from '@/components/filters';
import Layout from '@/components/Layout';
import { StudentAbsentProps } from '@/components/Students';
import StudentAbsentTable from '@/components/Students/tables/StudentAbsentTable';
import ExportExcelButton from '@/components/ui/Button/ExportExcelButton';
import { VolverPanel } from '@/components/ui/VolverPanel';
import { ExcelColumn } from '@/context';
import { useQuery } from '@/context/QueryContext';
import { useEffect, useState } from 'react';

export default function StudentAbsent() {

    const { StudentAbsent, exportExcel } = useQuery();

    const [data, setData] = useState<StudentAbsentProps[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingExcel, setLoadingExcel] = useState(false);
    
    const [filters, setFilters] = useState<StudentAbsentFilter>({
        status: 'A',
        jornada: '',
    });

    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(8);

    const fetchStudentAbsent = async () => {
        setLoading(true);
        try {
            console.log("F:", filters)
            const response = await StudentAbsent({
                ...filters,
                page,
                pageSize,
            });
            console.log("RES:", response)

            setData(response.results);
            setCount(response.count);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudentAbsent();
    }, [filters, page]);

    const handleFilter = (newFilters: StudentAbsentFilter) => {
        setPage(1);
        setFilters(newFilters);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleExport = async () => {
        setLoadingExcel(true);

        const columns: ExcelColumn<StudentAbsentProps>[] = [
            { key: 'nombre_completo', label: 'Nombre completo' },
            { key: 'tipo_documento', label: 'Tipo documento' },
            { key: 'numero_documento', label: 'Número documento' },
            { key: 'modulo', label: 'Módulo' },
            { key: 'fecha', label: 'Fecha' },
            { key: 'celular', label: 'Celular' },
            { key: 'total_inasistencia', label: 'Total inasistencias' },
        ];

        const title = "ESTUDIANTES AUSENTES";
        const filename = "estudiantes_ausentes";

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
                            ESTUDIANTES AUSENTES
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <ExportExcelButton
                            refresh={loading || loadingExcel}
                            onClick={handleExport}
                        />
                    </div>
                </div>

                <StudentAbsentTable
                    data={data}
                    loading={loading}
                    onRefresh={fetchStudentAbsent}
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
