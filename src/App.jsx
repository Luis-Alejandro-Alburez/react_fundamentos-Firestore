import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Products from "./pages/Products/Products";
import { StoreContextProvider } from "./context/StoreContext";
import { Cart } from "./pages/Cart/Cart";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login/Login";
import { NavBar } from "./components/NavBar";
import Orders from "./pages/Orders/Orders";

function App() {
  return (
    <StoreContextProvider>
      <BrowserRouter>
        <NavBar />

        <Routes>
          <Route path="/" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreContextProvider>
  );
}

export default App;
