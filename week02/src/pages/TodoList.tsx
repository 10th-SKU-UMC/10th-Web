import TodoForm from "../components/TodoForm";
import TodoItem from "../components/TodoItem";
import { useTodo } from "../context/TodoContext";

const TodoList = () => {
  const { todos, toggleTodo, deleteTodo } = useTodo();

  const incompleteTodos = todos.filter((todo) => !todo.complete);
  const completeTodos = todos.filter((todo) => todo.complete);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-120 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <div className="p-4 text-center text-2xl font-bold dark:text-white">
          To Do List
        </div>
        <TodoForm />

        <div className="mt-6 grid grid-cols-2 gap-8 px-4">
          <div>
            <p className="mb-4 text-center text-xl font-semibold dark:text-white">
              할 일
            </p>
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
            <p className="mb-4 text-center text-xl font-semibold dark:text-white">
              완료
            </p>
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
