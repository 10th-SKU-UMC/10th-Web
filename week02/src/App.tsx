import Navbar from "./components/NavBar";
import TodoList from "./pages/TodoList";

export default function App() {
  return (
    <div className="dark:bg-gray-900 min-h-screen">
      <Navbar />
      <div className="pt-14">
        <TodoList />
      </div>
    </div>
  );
}
