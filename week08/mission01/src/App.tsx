import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomeLayout from "./layouts/HomeLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import GoogleCallbackPage from "./pages/GoogleCallbackPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import LpCreatePage from "./pages/LpCreatePage";
import LpDetailPage from "./pages/LpDetailPage";
import MyPage from "./pages/MyPage";
import NotFoundPage from "./pages/NotFoundPage";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/v1/auth/google/callback" element={<GoogleCallbackPage />} />

          <Route element={<HomeLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/lps/:lpid" element={<LpDetailPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/lps/new" element={<LpCreatePage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
