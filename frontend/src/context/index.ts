export interface ExcelColumn<T> {
  key: keyof T;
  label: string;
}