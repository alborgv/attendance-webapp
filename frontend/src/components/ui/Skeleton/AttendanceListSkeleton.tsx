export default function AttendanceListSkeleton() {
    return (

        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container-fluid max-w-6xl mx-auto px-4">
                <h1 className="text-3xl font-sans font-bold text-gray-900 mb-8">LISTA DE ASISTENCIAS ACTIVAS</h1>

                <hr className='mb-6 opacity-20' />

                <div className="space-y-6">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                    <div className="flex-1 mb-4 lg:mb-0">
                                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-1 animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                                    </div>

                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:w-2/3">
                                        <div>
                                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-1 animate-pulse"></div>
                                            <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                                        </div>
                                        <div>
                                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-1 animate-pulse"></div>
                                            <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                                        </div>
                                        <div className="flex space-x-2 col-span-2 lg:col-span-1">
                                            <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
                                            <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}