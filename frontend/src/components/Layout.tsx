import Navbar from "@/components/Navbar";

const Layout: React.FC<ChildrenProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 p-4 overflow-auto">
                {children}
            </main>
        </div>
    );
};

export default Layout;
