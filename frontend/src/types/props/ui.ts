export interface CalendarProps {
    currentMonth: Date;
    selectedDate: Date;
    onMonthChange: (date: Date) => void;
    onDateSelect: (date: Date) => void;
    getDateAttendanceStatus: (date: Date) => string;
    isEdit?: boolean;
}
