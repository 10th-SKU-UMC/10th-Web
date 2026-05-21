import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import DebouncePage from "../pages/DebouncePage";
import ThrottlingPage from "../pages/ThrottlingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <DebouncePage /> },
      { path: "throttling", element: <ThrottlingPage /> },
    ],
  },
]);
