export type Todo = {
  id: number;
  text: string;
  complete: boolean;
};

export type TodoItemProps = {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
};
