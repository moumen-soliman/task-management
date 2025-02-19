export type dataView = "table" | "kanban";

export interface DataViewState {
  dataView: dataView;
  filteredTasksList: Task[];
  visibleCount: number;
  sortColumn: keyof Task | null;
  sortDirection: "asc" | "desc" | null;
  filters: {
    title: string;
    priority: string;
    status: string;
  };
  selectedIds: Array<string | number>;
  toggleSelection: (id: number | string) => void;
  selectAll: (ids: number[]) => void;
  clearSelection: () => void;
  setVisibleCount: (count: number | ((prev: number) => number)) => void;
  setSortColumn: (column: keyof Task | null) => void;
  setSortDirection: (direction: "asc" | "desc" | null) => void;
  setFilter: (filter: Partial<DataViewState["filters"]>) => void;
  setSortColumnAndDirection: (column: keyof Task) => void;
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setDataView: (dataView: dataView) => void;
  updateSelectedTasks: (updates: Partial<Task>) => void;
}
