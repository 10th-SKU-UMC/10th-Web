interface HeaderProps {
  currentPage: "counter" | "company";
  onNavigate: (page: "counter" | "company") => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="max-w-3xl mx-auto px-6 h-12 flex items-center gap-6">
        <span className="text-sm font-bold text-gray-800 mr-4">
          useReducer 실습
        </span>
        <button
          onClick={() => onNavigate("counter")}
          className={`text-sm font-medium pb-0.5 transition-colors ${
            currentPage === "counter"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Counter
        </button>
        <button
          onClick={() => onNavigate("company")}
          className={`text-sm font-medium pb-0.5 transition-colors ${
            currentPage === "company"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Company
        </button>
      </div>
    </header>
  );
}
