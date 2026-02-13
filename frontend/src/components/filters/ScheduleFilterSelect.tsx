import { FilterProps, ScheduleFilter} from ".";

const ScheduleFilterSelect: React.FC<FilterProps<ScheduleFilter>> = ({
    value,
    onChange
}) => {
    return (
        <>
            <select className="flex items-center p-2 bg-white rounded-xl border
            border-gray-300 shadow-sm hover:shadow-md transition-shadow
             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                value={value}
                onChange={(e) => onChange(e.target.value as ScheduleFilter)}>
                <option value="">TODAS</option>
                <option value="MAÑANA 7 - 9:30">MAÑANA 7 - 9:30</option>
                <option value="MAÑANA 10:15 - 12:45">MAÑANA 10:15 - 12:45</option>
                <option value="TARDE 1:30 - 4">TARDE 1:30 - 4</option>
                <option value="TARDE 4 - 6:30">TARDE 4 - 6:30</option>
                <option value="VIERNES MAÑANA">VIERNES MAÑANA</option>
                <option value="VIERNES TARDE">VIERNES TARDE</option>
                <option value="SABADO MAÑANA">SÁBADO MAÑANA</option>
                <option value="SABADO TARDE">SÁBADO TARDE</option>
                <option value="DOMINGO">DOMINGO</option>
                <option value="NOCHE">NOCHE</option>
            </select>
        </>
    )
}


export default ScheduleFilterSelect;