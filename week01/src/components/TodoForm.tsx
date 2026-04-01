import { useState } from "react";

interface TodoFormProps {
  onAdd: (text: string) => void;
}

const TodoForm = ({ onAdd }: TodoFormProps) => {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (!value.trim()) return;
    onAdd(value.trim());
    setValue("");
  };

  return (
    <div className="flex justify-evenly gap-3 px-4">
      <input
        className="flex-1 bg-white shadow-md rounded-md h-10 text-center"
        placeholder="할 일을 입력"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="rounded bg-green-500 px-3 py-1 font-medium text-white cursor-pointer"
      >
        추가
      </button>
    </div>
  );
};

export default TodoForm;
