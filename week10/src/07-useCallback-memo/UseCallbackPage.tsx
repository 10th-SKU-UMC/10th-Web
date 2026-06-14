import { useCallback, useState } from "react";
import CountButton from "./components/CountButton";
import TextInput from "./components/TextInput";

export default function UseCallbackPage() {
  const [count, setCount] = useState<number>(0);
  const [text, setText] = useState<string>("");

  const handleIncreaseCount = useCallback(
    (number: number) => {
      setCount(count + number);
    },
    [count],
  );

  const handleText = useCallback((text: string) => {
    setText(text);
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center  mt-10">
        <h1>함께 배우는 리액트</h1>
        <h3>Count : {count}</h3>
        <CountButton onClick={handleIncreaseCount} />
        <h2>Text</h2>
        <span>{text}</span>
        <TextInput onChange={handleText} />
      </div>
    </>
  );
}
