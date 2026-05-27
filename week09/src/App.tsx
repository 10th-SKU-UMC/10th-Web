import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CartPage from "./pages/cartPage";
import Layout from "./layouts/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [{ path: "cart", element: <CartPage /> }],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
