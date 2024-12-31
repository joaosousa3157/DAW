import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ScrollToTop from './components/ScrollToTop'
import { UserProvider } from "./context/UserContext";
import { CheckoutProvider } from "./context/CheckoutContext";
import "./css/global.css";

import {
  AboutPage,
  CheckoutPage,
  DealsPage,
  HomePage,
  MiscPage,
  WinesPage,
  ProfilePage,
  LoginPage,
  RegisterPage,
  WineDetailPage,
} from "./pages/index";




const App: React.FC = () => {
  return (
    <UserProvider>
      <CheckoutProvider>
        <Router>
          <NavBar />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/wines" element={<WinesPage />} />
            <Route path="/cart" element={<CheckoutPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/misc" element={<MiscPage />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/wines/:id" element={<WineDetailPage />} />
          </Routes>
          <Footer />
        </Router>
      </CheckoutProvider>
    </UserProvider>
  );
};

export default App;
