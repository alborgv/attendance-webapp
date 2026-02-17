import { MetricsCardProps } from "@/types/ui/cards";
import { HiTrendingUp } from "react-icons/hi";
import { Link } from "react-router-dom";

const MetricsCard: React.FC<MetricsCardProps> = ({ title, icon, value, url }) => {
    
    const isNumber =
        typeof value === "number" ||
        (typeof value === "string" && !isNaN(Number(value)));

    const urlBackend = import.meta.env.VITE_HOME_URL;

    const CardContent = (
        <div className="group bg-linear-to-br bg-white p-6 rounded-2xl shadow-lg
                        border-slate-200 hover:shadow-2xl hover:scale-[1.02] transition-all
                        duration-300 block">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">

                <div className="order-1 md:order-2 flex justify-start md:justify-end mb-4">
                    <div className="p-3 bg-blue-600 group-hover:bg-blue-700 rounded-xl">
                        <div className="text-white">
                            {icon}
                        </div>
                    </div>
                </div>
                
                <div className="order-2 md:order-1 text-left">
                    <h3 className="text-sm font-sora font-semibold md:text-xs md:font-normal md:uppercase tracking-wider text-blue-600">
                        {title}
                    </h3>
                    <div className="items-center gap-2 mt-1 hidden md:flex">
                        <HiTrendingUp className="text-green-500" />
                        <span className="text-xs text-green-600 font-medium">
                            En funcionamiento
                        </span>
                    </div>
                </div>
            </div>

            <div className="min-h-10">
                <p className={`
                        font-roboto font-semibold text-gray-900
                        ${isNumber ? "text-2xl md:text-4xl" : "text-xs md:text-sm"}
                    `}>
                        {value}
                </p>
            </div>
        </div>
    );

    if (!url) return CardContent;

    return (
        <Link to={url} className="block">
            {CardContent}
        </Link>
    )
}


export default MetricsCard;