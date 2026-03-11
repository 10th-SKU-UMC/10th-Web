import TodoForm from "../components/TodoForm";

const TodoList = () => {
  return (
    <div className="flex justify-center items-center bg-gray-50 min-h-screen shadow-2xl">
      <div className="w-120 rounded-lg bg-white shadow-md p-4">
        <div className="text-center font-bold text-2xl p-4">To Do List</div>

        <TodoForm />

        <div className="flex flex-row gap-20 justify-evenly text-xl p-4">
          <p>할 일</p>
          <p>완료</p>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
