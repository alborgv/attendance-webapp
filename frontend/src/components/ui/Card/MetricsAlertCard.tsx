import { FaExclamationCircle } from "react-icons/fa";

interface Props {
    total: number;
}

export default function MetricsAlertCard({ total }: Props) {
    if (total <= 0) return null;

    let bg = "";
    let border = "";
    let text = "";
    let icon = "";
    let msgTitle = "";
    let msgDetail = "";

    if (total > 0 && total <= 40) {
        bg = "bg-yellow-50";
        border = "border-yellow-400";
        text = "text-yellow-800";
        icon = "text-yellow-600";
        msgTitle = `Atención: Se han registrado ${total} inasistencias`;
        msgDetail = "Se recomienda revisar los reportes de asistencia.";
    }
    else if (total > 40 && total <= 100) {
        bg = "bg-orange-100/70";
        border = "border-orange-400";
        text = "text-orange-800";
        icon = "text-orange-600";
        msgTitle = `Advertencia: ${total} inasistencias registradas`;
        msgDetail = "La cantidad es considerable. Se sugiere tomar acciones correctivas.";
    }
    else {
        bg = "bg-red-100/70";
        border = "border-red-400";
        text = "text-red-800";
        icon = "text-red-600";
        msgTitle = `Alerta crítica: ${total} inasistencias detectadas`;
        msgDetail = "Requiere atención inmediata. Es recomendable contactar a los monitores.";
    }

    return (
        <div className={`mt-6 ${bg} border ${border} rounded-xl p-4`}>
            <div className="flex items-start gap-3">
                <FaExclamationCircle className={`${icon} mt-1`} />
                <div>
                    <p className={`${text} font-medium`}>{msgTitle}</p>
                    <p className={`${text} text-sm mt-1`}>{msgDetail}</p>
                </div>
            </div>
        </div>
    );
}
