import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './AppRoutes';
import Footer from './components/Footer';
import LeaseChatbotModal from './components/LeaseChatbotModal';
import OtpResetModal from './components/OtpResetModal';

export default function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
      <Footer />
      <LeaseChatbotModal />
      <OtpResetModal />
    </BrowserRouter>
  );
}
