import create from 'zustand';

const useTableStore = create((set) => ({
  tableData: [],
  setTableData: (data) => set({ tableData: data }),
  subscribe: (callback) => {
    const unsubscribe = useTableStore.subscribe(callback);
    return unsubscribe;
  },
}));

export default useTableStore;
