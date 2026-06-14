import { memo } from "react";

interface ITextInput {
  onChange: (text: string) => void;
}

const TextInput = ({ onChange }: ITextInput) => {
  console.log("TextInput이 렌더링되었습니다.");
  return (
    <input
      type="text"
      className="border p-2 rounded-lg"
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default memo(TextInput);
