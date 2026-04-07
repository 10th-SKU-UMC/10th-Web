import MoviesPage from "./pages/MoviePage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: 'movies/:category',
        element: <MoviesPage />,
      },
      {
        path: 'movies/detail/:movieId',
        element: <MovieDetailPage />
      }
    ]
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;