import Layout from "@/components/Layout";

export default function TakeAttendanceSkeleton() {
    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container-fluid max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        <aside className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="animate-pulse">
                                <div className="h-6 bg-gray-200 rounded w-24 mb-6"></div>
                                
                                <div className="h-8 bg-gray-200 rounded w-32 mb-4"></div>
                                <div className="grid grid-cols-7 gap-2 mb-2">
                                    {[...Array(7)].map((_, i) => (
                                        <div key={i} className="h-6 bg-gray-200 rounded"></div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-2">
                                    {[...Array(35)].map((_, i) => (
                                        <div key={i} className="h-8 bg-gray-200 rounded"></div>
                                    ))}
                                </div>
                                
                                <div className="mt-6 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                </div>
                            </div>
                        </aside>

                        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="animate-pulse">
                                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
                                
                                <div className="h-10 bg-gray-200 rounded w-32 mb-6"></div>
                                
                                <div className="space-y-4">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-center space-x-4">
                                                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                                                <div className="space-y-2">
                                                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
}