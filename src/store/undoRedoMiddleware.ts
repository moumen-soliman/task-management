import { STORAGE_KEY } from "@/constants/tasks";

const undoRedoMiddleware = (config) => (set, get) => {
    return {
      ...config((partialState) => {
        const prevState = get();  // Save previous state before modification
  
        set((state) => {
          return {
            ...typeof partialState === "function" ? partialState(state) : partialState,  // Ensure function compatibility
            history: [...state.history, prevState],  // Store previous state for undo
          };
        });
      }, get),
  
      undo: () => {
        const { history, redoStack, tasks } = get();
        if (history.length === 0) return; // Prevent undoing when history is empty
      
        const lastState = history.pop();
      
        if (!lastState.tasks || lastState.tasks.length === 0) {
          console.warn("Undo reached an empty state, skipping...");
          return; // Prevents saving an empty state
        }

        set({
            ...lastState,
            redoStack: [...redoStack, { tasks }], // Store the current state for redo
          });
        
          localStorage.setItem(STORAGE_KEY, JSON.stringify(lastState.tasks)); // Update localStorage
        },

      redo: () => {
        const { history, redoStack } = get();
        if (redoStack.length === 0) return;

        const nextState = redoStack.pop();
        set({
          ...nextState,
          history: [...history, get()],
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState.tasks)); // Update tasks storage
      }
    };
  };
  
  export default undoRedoMiddleware;
  