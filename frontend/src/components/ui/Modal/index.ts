export interface ChangePasswordModalProps {
    open: boolean;
    title?: string;
    onConfirm: (password: string) => Promise<void>;
    onCancel: () => void;
}

export const EXCEL_MIME_TYPES = [
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
];

export const EXCEL_EXTENSIONS = [".xls", ".xlsx"];
