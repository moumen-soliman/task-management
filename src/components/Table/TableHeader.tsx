import React from 'react';

interface TableHeaderProps {
    columns: {
        key: string;
        label: string;
    }[];
}

// Example columns for task management
const taskColumns = [
    { key: 'title', label: 'Title' },
    { key: 'status', label: 'Status' },
    { key: 'priority', label: 'Priority' },
    { key: 'assign', label: 'Assign' },
    { key: 'sprint', label: 'Sprint' }
];

const TableHeader: React.FC<TableHeaderProps> = ({ columns = taskColumns }) => {
    return (
        <div className='flex items-center justify-between'>
                {columns.map((column) => (
                    <span key={column.key}>{column.label}</span>
                ))}
        </div>
    );
};

export default TableHeader;