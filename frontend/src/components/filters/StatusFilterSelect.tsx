import { StatusFilter, FilterProps } from ".";


const StatusFilterSelect: React.FC<FilterProps<StatusFilter>> = ({
    value,
    onChange
}) => {
    return (
        <>
            <select className="flex items-center p-2 bg-white rounded-xl border
            border-gray-300 shadow-sm hover:shadow-md transition-shadow
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                value={value}
                onChange={(e) => onChange(e.target.value as StatusFilter)}>
                <option value="A" >Activos</option>
                <option value="I">Inactivos</option>
            </select>
        </>
    )
}


export default StatusFilterSelect;