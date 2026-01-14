import Layout from '@/components/Layout';
import StudentSearchModal from '@/components/ui/Modal/StudentSearchModal';
import MonitorTable from '@/components/ui/Table/MonitorTable';
import { useQuery } from '@/context/QueryContext';
import { Student } from '@/types/props/students';
import { useState } from 'react';
import { LuUserPlus } from 'react-icons/lu';

export default function MonitorManagement() {
    
    const { addMonitor } = useQuery();

    const [isStudentSearchModalOpen, setIsStudentSearchModalOpen] = useState(false);
    
    const handleClick = async () => {
        setIsStudentSearchModalOpen(true);
    }

    const handleCloseModal = async () => {
        setIsStudentSearchModalOpen(false);
    }

    const onAddMonitor = async (student: Student) => {
        console.log("STUDENT:", student)
        const monitor = await addMonitor(student.id)
        console.log("MONITOR:", monitor)
        setIsStudentSearchModalOpen(false);
    }

    return (
        <Layout>
            <div className="mb-8 p-4 md:p-6">

                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className='px-4'>
                        <h2 className="text-xl md:text-2xl font-sans font-bold text-gray-800">
                            LISTA DE MONITORES
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">

                        <button
                            onClick={handleClick}
                            // disabled={refreshing}
                            className="flex items-center gap-3 px-4 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white
                            rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl
                            disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {/* <FaSync className={`text-lg ${refreshing ? 'animate-spin' : ''}`} /> */}
                            <LuUserPlus size={20} />
                            <span className="font-semibold">Agregar monitor</span>
                        </button>
                    </div>
                </div>
                <MonitorTable />
            </div>
            
            <StudentSearchModal
                isOpen={isStudentSearchModalOpen}
                onClose={handleCloseModal}
                onSelectStudent={onAddMonitor}
            />
        </Layout>
    );
}