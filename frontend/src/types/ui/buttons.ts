import { ReactNode } from "react";

export interface IconActionButtonProps {
    icon: ReactNode;
    label: string;
    color: "green" | "blue" | "red";
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
}