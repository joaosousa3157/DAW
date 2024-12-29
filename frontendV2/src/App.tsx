import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {AboutPage, CheckoutPage, DealsPage ,HomePage, MiscPage, WinesPage, ProfilePage, LoginPage, RegisterPage} from './pages/index';

import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { UserProvider } from './context/UserContext';

import "./css/global.css"

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <NavBar />
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
        </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
};

export default App;
