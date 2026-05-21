import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import PopularPage from "../pages/PopularPage";
import UpcomingPage from "../pages/UpcomingPage";
import MovieDetailPage from "../pages/MovieDetailPage";
import TopRatedPage from "../pages/TopRatedPage";
import NowPlayingPage from "../pages/NowPlayingPage";
import MoviePage from "../pages/MoviePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <MoviePage /> },
      { path: "popular", element: <PopularPage /> },
      { path: "upcoming", element: <UpcomingPage /> },
      { path: "top-rated", element: <TopRatedPage /> },
      { path: "now-playing", element: <NowPlayingPage /> },
      { path: "movie/:movieId", element: <MovieDetailPage /> },
    ],
  },
]);
