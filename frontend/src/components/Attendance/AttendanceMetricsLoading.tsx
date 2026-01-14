const AttendanceMetricsLoading = () => {
    return (
        <div className="mb-8 animate-pulse">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded mt-2"></div>
                </div>
                <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-6 w-32 bg-gray-200 rounded"></div>
                            <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                        </div>
                        <div className="h-10 w-24 bg-gray-300 rounded"></div>
                        <div className="h-4 w-40 bg-gray-200 rounded mt-4"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AttendanceMetricsLoading;
