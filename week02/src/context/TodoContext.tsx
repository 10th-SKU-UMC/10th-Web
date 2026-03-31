import { createContext, useContext, useState } from "react";
import type { PropsWithChildren } from "react";
import type { TTodo } from "../types/todo";

interface ITodoContext {
  todos: TTodo[];
  doneTodos: TTodo[];
  addTodo: (text: string) => void;
  completeTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

const TodoContext = createContext<ITodoContext | undefined>(undefined);

export const TodoProvider = ({ children }: PropsWithChildren) => {
  const [todos, setTodos] = useState<TTodo[]>([]);
  const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);

  const addTodo = (text: string) => {
    const newTodo: TTodo = {
      id: Date.now(),
      text,
    };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  const completeTodo = (id: number) => {
    const targetTodo = todos.find((todo) => todo.id === id);
    if (!targetTodo) return;

    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    setDoneTodos((prevDoneTodos) => [...prevDoneTodos, targetTodo]);
  };

  const deleteTodo = (id: number) => {
    setDoneTodos((prevDoneTodos) =>
      prevDoneTodos.filter((todo) => todo.id !== id)
    );
  };

  return (
    <TodoContext.Provider
      value={{ todos, doneTodos, addTodo, completeTodo, deleteTodo }}
    >
      {children}
    </TodoContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTodo = () => {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error("useTodo must be used within a TodoProvider");
  }

  return context;
};