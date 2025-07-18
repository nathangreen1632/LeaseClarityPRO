import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import AppRoutes from './AppRoutes.js';
import Footer from "./components/Footer.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
      <Footer />
    </BrowserRouter>
  );
}
