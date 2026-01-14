import { format as dateFnsFormat } from 'date-fns';
import { es } from 'date-fns/locale';

export const format = (date: Date, formatStr: string) => {
  const formatDate = dateFnsFormat(date, formatStr, { locale: es });
  return formatDate
};
