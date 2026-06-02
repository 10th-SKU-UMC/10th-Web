import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import UseReducerCompany from "./UseReducerCompany";
import UseReducerPage from "./useReducerPage";

type Page = "counter" | "company";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("counter");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="pt-12">
        {currentPage === "counter" ? <UseReducerPage /> : <UseReducerCompany />}
      </main>
    </div>
  );
}
