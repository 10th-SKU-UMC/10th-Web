import { useMemo, useState } from "react";
import TextInput from "./components/TextInput";
import { findPrimeNumbers } from "./utils/math";

export default function UseMemoPage() {
  console.log("rerender");

  const [limit, setLimit] = useState<number>(0);
  const [text, setText] = useState<string>("");

  const handleCahngeText = (text: string) => {
    setText(text);
  };

  const primes = useMemo(() => findPrimeNumbers(limit), [limit]);

  return (
    <div className="flex flex-col items-center justify-center  mt-10 gap-5">
      <h1>같이 배우는 리액트 : useMemo</h1>
      <label>
        숫자입력(소수찾기) :
        <input
          type="number"
          value={limit}
          className="border-2 border-gray-300 rounded-md p-2"
          onChange={(e) => setLimit(Number(e.target.value))}
        />
      </label>

      <h2>소수 리스트 :</h2>
      <div className="flex flex-wrap gap-2">
        {primes.map((prime) => (
          <span key={prime} className="inline-block mr-2">
            {prime}
          </span>
        ))}
      </div>
      <label>
        {text}
        다른 입력 텍스트 : <TextInput onChange={handleCahngeText} />
      </label>
    </div>
  );
}
