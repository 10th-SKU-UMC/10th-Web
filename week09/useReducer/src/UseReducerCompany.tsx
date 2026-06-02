import { useReducer, useState } from "react";
import type { ChangeEvent } from "react";

interface IState {
  department: string;
  error: string | null;
}

interface IAction {
  type: "CHANGE_DEPARTMENT" | "RESET";
  payload?: string;
}

const initialState: IState = {
  department: "Software Developer",
  error: null,
};

function reducer(state: IState, action: IAction): IState {
  const { type, payload } = action;

  switch (type) {
    case "CHANGE_DEPARTMENT": {
      const newDepartment = payload ?? "";
      const hasError = newDepartment !== "카드메이커";
      return {
        ...state,
        department: hasError ? state.department : newDepartment,
        error: hasError
          ? "거부권 행사가능, 카드메이커만 입력 가능합니다."
          : null,
      };
    }
    case "RESET": {
      return initialState;
    }
    default:
      return state;
  }
}

export default function UseReducerCompany() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [inputValue, setInputValue] = useState("");

  const handleChangeDepartment = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    dispatch({ type: "CHANGE_DEPARTMENT", payload: inputValue });
  };

  const handleReset = () => {
    dispatch({ type: "RESET" });
    setInputValue("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-md p-6 w-80 flex flex-col gap-3">
        <h1 className="text-base font-semibold text-gray-700">
          현재 직무: <span className="text-blue-600">{state.department}</span>
        </h1>
        {state.error && <p className="text-red-400 text-xs">{state.error}</p>}
        <input
          className="w-full border border-gray-300 p-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="변경할 직무를 입력해주세요"
          value={inputValue}
          onChange={handleChangeDepartment}
        />
        <div className="flex gap-2">
          <button
            className="flex-1 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={handleSubmit}
          >
            직무 변경
          </button>
          <button
            className="flex-1 py-1.5 text-sm bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            onClick={handleReset}
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  );
}
