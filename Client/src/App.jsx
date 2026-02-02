import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthLayout from './components/AuthLayout';
import Login from './Pages/Login';
import OtpVerification from './Pages/OtpVerification';
import DashboardLayout from './components/DashboardLayout';
import Home from './Pages/Home';
import Products from './Pages/Products';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<OtpVerification />} />
        </Route>

        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
