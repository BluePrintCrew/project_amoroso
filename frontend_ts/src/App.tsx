import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Header from './components/Header/Header';
import LoginForm from './pages/Login/LoginForm';
import MainPage from './pages/MainPage/MainPage';
import PlaceholderPage from './pages/PlaceholderPage';
import ProductsPage from './pages/ProductsPage';
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="appMain">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route
              path="/admin/login"
              element={<PlaceholderPage title="Seller Login" />}
            />
            <Route path="/cart" element={<PlaceholderPage title="Cart" />} />
            <Route path="/mypage" element={<PlaceholderPage title="My Page" />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="*" element={<PlaceholderPage title="Not Found" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
