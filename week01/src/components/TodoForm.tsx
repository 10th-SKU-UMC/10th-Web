const TodoForm = () => {
  return (
    <div>
      <div className="flex justify-evenly gap-3 px-4">
        <input
          className="flex-1 bg-white shadow-md h-7 rounded-md h-10 text-center"
          placeholder="할 일을 입력하세요"
        ></input>
        <button className="bg-green-500 text-white px-2 py-1 rounded-md cursor-pointer">
          추가
        </button>
      </div>
    </div>
  );
};

export default TodoForm;
