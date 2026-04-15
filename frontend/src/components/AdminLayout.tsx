import React from "react";
import Navbar from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <div className="flex flex-1 overflow-hidden">
                <AdminSidebar />

                <main className="flex-1 overflow-auto p-4 pb-20 md:pb-4">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
