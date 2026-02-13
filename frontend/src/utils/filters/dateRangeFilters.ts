import { StudentAbsentFilter, StudentAbsentPreset } from "@/components/filters";
import { StudentAbsentProps } from "@/components/students";

function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function applyDateRangeFilters(
  data: StudentAbsentProps[],
  filters: StudentAbsentFilter
) {
  if (!filters.startDate || !filters.endDate) {
    return data;
  }
  
  const start = parseLocalDate(filters.startDate);
  const end = parseLocalDate(filters.endDate);
  end.setHours(23, 59, 59, 999);

  return data.filter((student) => {
    if (!student.fecha) return false;

    const date = parseLocalDate(student.fecha);

    if (date < start || date > end) return false;

    if (
      filters.jornada &&
      student.jornada !== filters.jornada
    ) {
      return false;
    }
    
    if (
      filters.status &&
      filters.status !== "ALL" &&
      student.estado !== filters.status
    ) {
      return false;
    }

    return true;
  });
}

export function getDateRangeByPreset(
    preset: StudentAbsentPreset,
    baseDate: Date = new Date()
): StudentAbsentFilter {
    const today = new Date(baseDate);
    today.setHours(0, 0, 0, 0);

    const format = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    let start: Date;
    let end: Date;

    switch (preset) {
        case "TODAY":
            start = new Date(today);
            end = new Date(today);
            break;

        case "YESTERDAY":
            start = new Date(today);
            start.setDate(start.getDate() - 1);
            end = new Date(start);
            break;

        case "LAST_7_DAYS":
            end = new Date(today);
            start = new Date(today);
            start.setDate(start.getDate() - 6);
            break;

        case "LAST_30_DAYS":
            end = new Date(today);
            start = new Date(today);
            start.setDate(start.getDate() - 29);
            break;

        case "THIS_MONTH":
            start = new Date(today.getFullYear(), today.getMonth(), 1);
            end = new Date(today);
            break;

        case "LAST_MONTH":
            start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            end = new Date(today.getFullYear(), today.getMonth(), 0);
            break;

        default:
            start = new Date(today);
            end = new Date(today);
    }

    return {
        preset: preset,
        startDate: format(start),
        endDate: format(end),
    };
}
