import { STORAGE_KEY } from "@/constants/tasks";
import { TaskStore } from "@/types/Tasks";

const undoRedoMiddleware = (config: any) => (
  set: (partial: TaskStore | ((state: TaskStore) => TaskStore)) => void,
  get: () => TaskStore
) => ({
      ...config((partialState: any) => {
        const prevState = get();  // Save previous state before modification
  
        set((state: TaskStore) => {
          return {
            ...typeof partialState === "function" ? partialState(state) : partialState,  // Ensure function compatibility
            // @ts-ignore-next-line
            history: [...state.history, prevState],  // Store previous state for undo
          };
        });
      }, get),
  
      undo: () => {
        // @ts-ignore-next-line
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
        // @ts-ignore-next-line
        const { history, redoStack } = get();
        if (redoStack.length === 0) return;

        const nextState = redoStack.pop();
        set({
          ...nextState,
          history: [...history, get()],
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState.tasks)); // Update tasks storage
      }
  })
  
  export default undoRedoMiddleware;
  