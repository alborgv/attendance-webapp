import { Column } from "../variants";

interface TableHeadProps<T> {
    columns: Column<T>[];
}

const TableHead = <T,>({ columns }: TableHeadProps<T>) => {
    return (
        <thead className="bg-gray-50">
            <tr>
                {columns.map(col => (
                    <th
                        key={col.key}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase"
                    >
                        {col.header}
                    </th>
                ))}
            </tr>
        </thead>
    );
};

export default TableHead;
