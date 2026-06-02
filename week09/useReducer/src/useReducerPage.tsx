import { useReducer, useState } from "react";

// 1. state에 대한 interface
interface IState {
  counter: number;
  error: string | null;
}

// 2. action에 대한 interface
interface IAction {
  type: "INCREASE" | "DECREASE" | "RESET_TO_ZERO";
  payload?: number;
}

function reducer(state: IState, action: IAction): IState {
  const { type, payload = 1 } = action;

  switch (type) {
    case "INCREASE": {
      return { ...state, counter: state.counter + payload, error: null };
    }
    case "DECREASE": {
      if (state.counter - payload < 0) {
        return { ...state, error: "카운터는 0 미만이 될 수 없습니다." };
      }
      return { ...state, counter: state.counter - payload, error: null };
    }
    case "RESET_TO_ZERO": {
      return { counter: 0, error: null };
    }
    default:
      return state;
  }
}

export default function UseReducerPage() {
  // 1. useState
  const [count, setCount] = useState(0);

  const handleIncrease = () => setCount((prev) => prev + 1);
  const handleDecrease = () => setCount((prev) => prev - 1);
  const handleReset = () => setCount(0);

  // 2. useReducer
  const [state, dispatch] = useReducer(reducer, {
    counter: 0,
    error: null,
  });

  return (
    <div className="min-h-[calc(100vh-3rem)] flex items-center justify-center bg-gray-50">
    <div className="bg-white rounded-xl shadow-md p-6 w-72 flex flex-col gap-6">
        {/* useState 섹션 */}
        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-slate-800">useState</h2>
          <p className="text-3xl font-bold text-slate-700">{count}</p>
          <div className="flex gap-2">
            <button
              onClick={handleIncrease}
              className="flex-1 rounded-lg bg-blue-500 py-1.5 text-xs font-medium text-white hover:bg-blue-600"
            >
              Increase
            </button>
            <button
              onClick={handleDecrease}
              className="flex-1 rounded-lg bg-rose-500 py-1.5 text-xs font-medium text-white hover:bg-rose-600"
            >
              Decrease
            </button>
            <button
              onClick={handleReset}
              className="flex-1 rounded-lg bg-slate-300 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-400"
            >
              Reset
            </button>
          </div>
        </section>

        <hr className="border-slate-200" />

        {/* useReducer 섹션 */}
        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-slate-800">useReducer</h2>
          <p className="text-3xl font-bold text-slate-700">{state.counter}</p>
          {state.error && (
            <p className="text-xs text-rose-500">{state.error}</p>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => dispatch({ type: "INCREASE" })}
              className="flex-1 rounded-lg bg-blue-500 py-1.5 text-xs font-medium text-white hover:bg-blue-600"
            >
              Increase
            </button>
            <button
              onClick={() => dispatch({ type: "DECREASE" })}
              className="flex-1 rounded-lg bg-rose-500 py-1.5 text-xs font-medium text-white hover:bg-rose-600"
            >
              Decrease
            </button>
            <button
              onClick={() => dispatch({ type: "RESET_TO_ZERO" })}
              className="flex-1 rounded-lg bg-slate-300 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-400"
            >
              Reset
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
