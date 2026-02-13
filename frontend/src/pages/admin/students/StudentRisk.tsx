import { StudentAlertFilter } from '@/components/filters';
import Layout from '@/components/Layout';
import { StudentAlertProps } from '@/components/students';
import StudentAlertTable from '@/components/students/tables/StudentAlertTable';
import ExportExcelButton from '@/components/ui/Button/ExportExcelButton';
import { VolverPanel } from '@/components/ui/VolverPanel';
import { ExcelColumn } from '@/context';
import { useQuery } from '@/context/QueryContext';
import { useEffect, useState } from 'react';

export default function StudentRisk() {
    const { StudentAlert, exportExcel } = useQuery();

    const [data, setData] = useState<StudentAlertProps[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingExcel, setLoadingExcel] = useState(false);

    const [filters, setFilters] = useState<StudentAlertFilter>({
        status: 'A',
        jornada: '',
    });

    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(8);

    const fetchStudentAlert = async () => {
        setLoading(true);
        try {
            const response = await StudentAlert({
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
        fetchStudentAlert();
    }, [filters, page]);
    
    const handleExport = async () => {
        setLoadingExcel(true);
        const columns: ExcelColumn<StudentAlertProps>[] = [
            { key: 'nombre_completo', label: 'Nombre completo' },
            { key: 'tipo_documento', label: 'Tipo documento' },
            { key: 'numero_documento', label: 'Número documento' },
            { key: 'jornada', label: 'Jornada' },
            { key: 'celular', label: 'Celular' },
            { key: 'estado', label: 'Estado' },
            { key: 'total_inasistencia', label: 'Total inasistencias' },
        ]

        let title = "ESTUDIANTES EN RIESGO DE BAJA";
        let filename = "estudiantes_en_riesgo"
        
        await exportExcel(filename, columns, title, data)
        setLoadingExcel(false);
    }

    // const handleFilter = async (statusFilter: StatusFilter) => {
    //     setStatusFilter(statusFilter);
    // }
    
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleFilter = (newFilters: StudentAlertFilter) => {
        setPage(1);
        setFilters(newFilters);
    };


    return (
        <Layout>
            <div className="mb-8 p-4 md:p-6">
                <VolverPanel />
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className='px-4'>
                        <h2 className="text-xl md:text-2xl font-sans font-bold text-gray-800">
                            ESTUDIANTES EN RIESGO DE BAJA
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <ExportExcelButton refresh={loading || loadingExcel} onClick={handleExport} />
                    </div>
                </div>
                <StudentAlertTable 
                    data={data}
                    loading={loading}
                    onRefresh={fetchStudentAlert}
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