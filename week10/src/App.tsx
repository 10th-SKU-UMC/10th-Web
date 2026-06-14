import "./App.css";
import MoviePage from "./pages/MoviePage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import UseCallbackPage from "./07-useCallback-memo/UseCallbackPage";
import UseMemoPage from "./08-useMemo/useMemoPage";

const router = createBrowserRouter([
  {
    path: "movies",
    element: <HomePage />, // 여기서 자식을 내려줄 때 outlet 처리를 해줘야함
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "category/:category",
        element: <MoviePage />,
      },
    ],
  },
  {
    path: "useCallback",
    element: <UseCallbackPage />,
  },
  { path: "useMemo", element: <UseMemoPage /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
