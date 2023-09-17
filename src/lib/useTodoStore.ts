import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type Todo = {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'doing' | 'done';
  date?: string;
  image?: string;
};

type TodoStore = {
  todos: Todo[];
  loadTodo: (todo: Todo[]) => void;
  addTodo: (todo: Todo) => void;
  toggleTodo: (id: number, status: 'todo' | 'doing' | 'done') => void;
  removeTodo: (id: number) => void;
};

export const useTodoStore = create<TodoStore>()(
  devtools(
    persist(
      (set) => ({
        todos: [],
        loadTodo: (todo) => 
          set({todos: todo}),
        addTodo: (todo) =>
          set((state) => ({ todos: [...state.todos, { ...todo }] })),
        toggleTodo: (id, status) =>
          set((state) => ({
            todos: state.todos.map((todo) =>
              todo.id === id
                ? {
                    ...todo,
                    status: status,
                  }
                : todo
            ),
          })),
        removeTodo: (id) =>
          set((state) => ({ todos: state.todos.filter((todo) => todo.id !== id) })),
      }),
      {
        name: 'todoStore'
      }
    )
  )
);
