import type { TTodo } from "../types/todo";

interface TodoListProps {
  title: string;
  todos: TTodo[];
  buttonText: string;
  buttonColor: string;
  onButtonClick: (id: number) => void;
}

const TodoList = ({
  title,
  todos,
  buttonText,
  buttonColor,
  onButtonClick,
}: TodoListProps) => {
  return (
    <div className="render-container__section">
      <h2 className="render-container__title">{title}</h2>
      <ul id="todo-list" className="render-container__list">
        {todos.map((todo) => (
          <li key={todo.id} className="render-container__item">
            <span className="render-container__item-text">{todo.text}</span>
            <button
              onClick={() => onButtonClick(todo.id)}
              style={{ backgroundColor: buttonColor }}
              className="render-container__item-button"
            >
              {buttonText}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;