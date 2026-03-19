import { useState } from "react";
import TodoForm from "../components/TodoForm";
import TodoItem from "../components/TodoItem";
import type { Todo } from "../types/Todo";

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (text: string) => {
    setTodos((prev) => [...prev, { id: Date.now(), text, complete: false }]);
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, complete: !todo.complete } : todo,
      ),
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const incompleteTodos = todos.filter((todo) => !todo.complete);
  const completeTodos = todos.filter((todo) => todo.complete);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-120 rounded-lg bg-white p-6 shadow-md">
        <div className="p-4 text-center text-2xl font-bold">To Do List</div>
        <TodoForm onAdd={addTodo} />

        <div className="mt-6 grid grid-cols-2 gap-8 px-4">
          <div>
            <p className="mb-4 text-center text-xl font-semibold">할 일</p>
            {incompleteTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={() => toggleTodo(todo.id)}
                onDelete={() => deleteTodo(todo.id)}
              />
            ))}
          </div>

          <div>
            <p className="mb-4 text-center text-xl font-semibold">완료</p>
            {completeTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={() => toggleTodo(todo.id)}
                onDelete={() => deleteTodo(todo.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
