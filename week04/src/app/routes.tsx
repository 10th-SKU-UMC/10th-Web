import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import PopularPage from "../pages/PopularPage";
import UpcomingPage from "../pages/UpcomingPage";
import MovieDetailPage from "../pages/MovieDetailPage";
import TopRatedPage from "../pages/TopRatedPage";
import NowPlayingPage from "../pages/NowPlayingPage";
import MoviePage from "../pages/MoviePage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <MoviePage category="popular" /> },
      { path: "popular", element: <PopularPage /> },
      { path: "upcoming", element: <UpcomingPage /> },
      { path: "top-rated", element: <TopRatedPage /> },
      { path: "now-playing", element: <NowPlayingPage /> },
      { path: "movie/:movieId", element: <MovieDetailPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
    ],
  },
]);
