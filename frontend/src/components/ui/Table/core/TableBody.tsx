import { Column } from "../variants";

interface TableBodyProps<T> {
    data: T[];
    columns: Column<T>[];
    rowKey: keyof T | ((row: T) => string | number);
    emptyMessage?: string;
}

const TableBody = <T,>({
    data,
    columns,
    rowKey,
    emptyMessage = 'No hay registros',
}: TableBodyProps<T>) => {
    
  const getKey = (row: T) =>
    typeof rowKey === 'function' ? rowKey(row) : String(row[rowKey]);

    if (data.length === 0) {
        return (
            <tbody>
                <tr>
                    <td
                        colSpan={columns.length}
                        className="px-6 py-8 text-center text-gray-500"
                    >
                        {emptyMessage}
                    </td>
                </tr>
            </tbody>
        );
    }

    return (
        <tbody className="divide-y divide-gray-200">
            {data.map(row => (
                <tr key={getKey(row)} className="hover:bg-gray-50">
                {columns.map(col => (
                    <td key={col.key} className="px-6 py-4">
                    {col.render(row)}
                    </td>
                ))}
                </tr>
            ))}
        </tbody>
    );
};

export default TableBody;
