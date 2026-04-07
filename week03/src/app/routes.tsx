import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import MoviesPage from "../pages/MoviePage";
import PopularPage from "../pages/PopularPage";
import UpcomingPage from "../pages/UpcomingPage";
import MovieDetailPage from "../pages/MovieDetailPage";
import TopRatedPage from "../pages/TopRatedPage";
import NowPlayingPage from "../pages/NowPlayingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <MoviesPage /> },
      { path: "popular", element: <PopularPage /> },
      { path: "upcoming", element: <UpcomingPage /> },
      { path: "top-rated", element: <TopRatedPage /> },
      { path: "now-playing", element: <NowPlayingPage /> },
      { path: "movie/:movieId", element: <MovieDetailPage /> },
    ],
  },
]);
