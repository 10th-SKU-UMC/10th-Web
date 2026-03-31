import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import { useTodo } from "../context/TodoContext";

const Todo = () => {
  const { todos, doneTodos, completeTodo, deleteTodo } = useTodo();

  return (
    <div className="todo-container">
      <h1 className="todo-container__header">ZIO TODO</h1>
      <TodoForm />
      <div className="render-container">
        <TodoList
          title="할 일"
          todos={todos}
          buttonText="완료"
          buttonColor="lightsteelblue"
          onButtonClick={completeTodo}
        />
        <TodoList
          title="완료"
          todos={doneTodos}
          buttonText="삭제"
          buttonColor="lightcoral"
          onButtonClick={deleteTodo}
        />
      </div>
    </div>
  );
};

export default Todo;