import { Link } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

type VolverPanelProps = {
  to?: string;
  label?: string;
  className?: string;
};

export const VolverPanel = ({
  to = "/",
  label = "Volver al panel",
  className = "",
}: VolverPanelProps) => {
  return (
    <Link
      to={to}
      className={`
        text-blue-600 hover:text-blue-800
        font-medium flex items-center
        transition-colors cursor-pointer
        text-sm sm:text-base px-4
        ${className}
      `}
    >
      <IoArrowBack size={14} className="mr-1 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
};
