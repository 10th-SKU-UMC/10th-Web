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

  return (
    <div className="flex justify-center items-center bg-gray-50 min-h-screen">
      <div className="w-120 rounded-lg bg-white shadow-md p-4">
        <div className="text-center font-bold text-2xl p-4">To Do List</div>
        <TodoForm onAdd={addTodo} />
        <div className="flex flex-row gap-20 justify-evenly text-xl p-4">
          <p>할 일</p>
          <p>완료</p>
        </div>
        <div className="px-4">
          {todos.map((todo) => (
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
  );
};

export default TodoList;
