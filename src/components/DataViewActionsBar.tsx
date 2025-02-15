import React from 'react';
import { useDataViewStore } from '@/store/useDataViewStore';
import { useSheetStore } from '@/store/useSheetStore';
import { useRouter } from 'next/navigation';
import { PRIORITIES_LIST, STATUS_LIST } from '@/constants/tasks';

const DataViewActionsBar: React.FC = () => {
    const setFilter = useDataViewStore((state) => state.setFilter);
    const setSortColumn = useDataViewStore((state) => state.setSortColumn);
    const setSortDirection = useDataViewStore((state) => state.setSortDirection);
    const openSheet = useSheetStore((state) => state.openSheet);
    const resetSheet = useSheetStore((state) => state.resetSheet);
    const router = useRouter();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter({ title: e.target.value });
    };

    const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter({ priority: e.target.value });
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter({ status: e.target.value });
    };

    const handleSortChange = (column: keyof Task, direction: 'asc' | 'desc') => {
        setSortColumn(column);
        setSortDirection(direction);
    };

    const handleAddTaskClick = () => {
        resetSheet();
        openSheet("create");
        router.replace(window.location.pathname, { scroll: false });
    };

    return (
        <div className='flex justify-between items-center mb-4'>
            <button
                onClick={handleAddTaskClick}
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            >
                ➕ Add Task
            </button>
            <input type="text" placeholder="Search by title" onChange={handleSearchChange} />
            <select onChange={handlePriorityChange}>
                <option value="">All Priorities</option>
                {PRIORITIES_LIST.map((priority) => (
                    <option key={priority} value={priority}>
                        {priority}
                    </option>
                ))}
            </select>
            <select onChange={handleStatusChange}>
                <option value="">All Statuses</option>
                {STATUS_LIST.map((status) => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </select>
            <button onClick={() => handleSortChange('title', 'asc')}>Sort by Title Asc</button>
            <button onClick={() => handleSortChange('title', 'desc')}>Sort by Title Desc</button>
        </div>
    );
};

export default DataViewActionsBar;
