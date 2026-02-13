export type CourseFiltersBD = {
    curso_id?: string;
    monitor_username?: string;
    estado?: string;
};

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}