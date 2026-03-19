import type { TodoItemProps } from "../types/Todo";

const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-100 rounded-lg mb-2 w-full">
      <p>{todo.text}</p>
      {!todo.complete ? (
        <button
          onClick={onToggle}
          className="rounded bg-green-500 px-3 py-1 font-medium text-white cursor-pointer"
        >
          완료
        </button>
      ) : (
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
