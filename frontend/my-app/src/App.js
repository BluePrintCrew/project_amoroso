import { Routes, Route } from 'react-router-dom'; 
import './index.css';

import MainPage from './pages/MainPage/MainPage';
import SignUpPage from './pages/SignUp/SignUpPage';
import ProductListPage from './pages/ProductListPage/ProductListPage';
import CartPage from './pages/CartPage/CartPage';
function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/products" element={<ProductListPage />} />
      <Route path="/cart" element={<CartPage />} />
    </Routes>
  );
}

export default App;
