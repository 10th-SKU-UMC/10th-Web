import type { TodoItemProps } from "../types/Todo";

const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  return (
    <div
      className={`flex items-center justify-between px-2 bg-gray-100 rounded-lg py-2 w-1/2 mb-2 ${todo.complete ? "ml-auto" : ""}`}
    >
      <p>{todo.text}</p>
      {!todo.complete && (
        <button
          onClick={onToggle}
          className="rounded bg-green-500 px-3 py-1 font-medium text-white cursor-pointer"
        >
          완료
        </button>
      )}
      {todo.complete && (
        <button
          onClick={onDelete}
          className="rounded bg-red-500 px-3 py-1 font-medium text-white cursor-pointer"
        >
          삭제
        </button>
      )}
    </div>
  );
};

export default TodoItem;
