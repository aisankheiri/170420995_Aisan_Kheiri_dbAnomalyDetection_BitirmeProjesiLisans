import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/admin/DashboardPage";
import AuthPageLayout from "./pages/AuthPageLayout/AuthPageLayout";
import ModelPage from "./pages/algorithms/ModelPage";
import ForgotPasswordComponent from "./components/Auth/ForgotPasswordComponent";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPageLayout />} />
      <Route path="/modelPage" element={<ModelPage />} />
      <Route path="/admin" element={<DashboardPage />} />
      <Route path="/auth-forgetpassword" element={<ForgotPasswordComponent />} />
     
    </Routes>
  );
}

export default App;
