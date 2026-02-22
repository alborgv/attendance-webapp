import Layout from '@/components/Layout';
import { Student, StudentFilters } from '@/components/Students';
import StudentListTable from '@/components/Students/tables/StudentListTable';
import { VolverPanel } from '@/components/ui/VolverPanel';
import { useQuery } from '@/context/QueryContext';
import { useEffect, useState } from 'react';

export default function AllStudentList() {
    const { getAllStudentsBasic } = useQuery();

    const [data, setData] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);
    
    const [filters, setFilters] = useState<StudentFilters>({
        status: 'A',
        jornada: ''
    });
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(8);

    const fetchStudent = async () => {
        setLoading(true);
        try {
            const response = await getAllStudentsBasic({
                username: filters.username,
                page,
                pageSize,
                status: filters.status,
                jornada: filters.jornada
            });
            
            setData(response.results);
            setTotal(response.count);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudent();
    }, [filters, page]);

    const handleFilter = async (filters: StudentFilters) => {
        setFilters(filters);
    }
    
    const handlePageChange = (page: number) => {
        setPage(page);
    }

    return (
        <Layout>
            <div className="mb-8 p-4 md:p-6">
                <VolverPanel />
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className='px-4'>
                        <h2 className="text-xl md:text-2xl font-sans font-bold text-gray-800">
                            LISTA DE ESTUDIANTES
                        </h2>
                    </div>
                </div>
                <StudentListTable 
                    data={data}
                    loading={loading}
                    onRefresh={fetchStudent}
                    filters={filters}
                    onFilter={handleFilter}
                    count={total}
                    currentPage={page}
                    onPageChange={handlePageChange}
                />
            </div>
        </Layout>
    );
}